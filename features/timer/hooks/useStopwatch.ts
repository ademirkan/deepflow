"use client";

import { useRef, useEffect, useState } from "react";

export type TimerEvent = {
    timeElapsed: number;
    callback: (now: Date, elapsedMs: number, startTime: Date) => void;
};

export type TimerCallbacks = {
    onStart?: (now: Date, elapsedSeconds?: number) => void; // called on first start
    onTick?: (now: Date, elapsedMs: number, startTime: Date) => void;
    onResume?: (now: Date, elapsedMs: number, startTime: Date) => void; // called on each subsequent resume
    onPause?: (now: Date, elapsedMs: number, startTime: Date) => void; // called on each timer pause
    onReset?: (now: Date, elapsedMs: number, startTime: Date) => void; // called on timer reset

    /**
     * If you need to schedule certain callbacks at specific times (in ms),
     * specify them here. They will fire in ascending order when timeElapsed >= their specified threshold.
     */
    onTickEvents?: TimerEvent[];
};

/**
 * A stopwatch hook that can accept an initial elapsed time (in ms)
 * and an initial "running" state. This makes it easier to hydrate from
 * a persisted or cached timer state.
 */
export default function useStopwatch(
    callbacks: TimerCallbacks,
    tickInterval: number = 1000,
    initialElapsedMs: number = 0,
    initialIsRunning: boolean = false
) {
    // STATE
    const [elapsedMs, setElapsedMs] = useState(initialElapsedMs); // current elapsed MS
    const [isRunning, setIsRunning] = useState(false); // is the timer actively running?
    const [isStarted, setIsStarted] = useState(false); // have we *ever* started since last reset?

    // REFS (to avoid stale closures)
    const elapsedMsRef = useRef(initialElapsedMs); // mirror of elapsedMs in ref form
    const lastUpdateRef = useRef(new Date()); // last "tick" time
    const callbacksRef = useRef(callbacks); // store callbacks
    const startTimeRef = useRef(new Date(Date.now() - initialElapsedMs));
    const eventsRef = useRef<TimerEvent[]>(
        callbacks.onTickEvents
            ? sortAndFilterEvents(callbacks.onTickEvents, initialElapsedMs)
            : []
    );

    /**
     * If initialIsRunning = true, we optionally "start" the timer on mount,
     * simulating a continued run. This means we consider the timer to have started
     * (isStarted = true) and it is actively ticking.
     *
     *  - We also call onStart(...) so external logic can respond, e.g. "resuming" a run.
     *  - If you prefer not to trigger onStart here, you could use onResume or omit it entirely.
     */
    useEffect(() => {
        if (initialIsRunning) {
            // Mark local states
            setIsRunning(true);
            setIsStarted(true);

            // The user might want to treat this scenario as a "start" or a "resume."
            // For simplicity, we'll treat it like a first start. Adjust to your preference.
            callbacksRef.current.onStart?.(new Date(), initialElapsedMs / 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    /**
     * Watch for changes in the callbacks object and update callbacksRef.
     * Also re-generate onTickEvents, removing any that have already happened.
     */
    useEffect(() => {
        callbacksRef.current = callbacks;
        eventsRef.current = callbacks.onTickEvents
            ? sortAndFilterEvents(callbacks.onTickEvents, elapsedMsRef.current)
            : [];
    }, [callbacks]);

    /**
     * If isRunning = true, we set up an interval to "tick" the stopwatch
     * each [tickInterval] ms. If it's false, we stop ticking.
     */
    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | null = null;

        if (isRunning) {
            intervalId = setInterval(tick, tickInterval);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, tickInterval]);

    /**
     * The core "tick" function that runs every [tickInterval].
     * We measure how much real time has passed since the last update.
     */
    function tick() {
        const now = new Date();
        const deltaMs = now.valueOf() - lastUpdateRef.current.valueOf();
        lastUpdateRef.current = now;

        // Update local + ref
        setElapsedMs((prev) => {
            const next = prev + deltaMs;
            elapsedMsRef.current = next;
            return next;
        });

        // Fire onTick callback
        callbacksRef.current.onTick?.(
            now,
            elapsedMsRef.current,
            startTimeRef.current
        );

        // Check if we need to fire any scheduled events
        while (
            eventsRef.current.length &&
            eventsRef.current[eventsRef.current.length - 1].timeElapsed <=
                elapsedMsRef.current
        ) {
            eventsRef.current
                .pop()
                ?.callback(now, elapsedMsRef.current, startTimeRef.current);
        }
    }

    /**
     * Start or Resume the stopwatch from a paused or reset state.
     */
    function start() {
        if (isRunning) throw new Error("Stopwatch is already running");
        const now = new Date();

        if (!isStarted) {
            // FIRST start
            callbacksRef.current.onStart?.(now, elapsedMsRef.current / 1000);
            setIsStarted(true);
        } else {
            // Subsequent resumes
            callbacksRef.current.onResume?.(
                now,
                elapsedMsRef.current,
                startTimeRef.current
            );
        }

        // If we have an existing elapsedMs, we want "startTimeRef" to reflect that:
        startTimeRef.current = new Date(now.valueOf() - elapsedMsRef.current);

        // Mark last update time
        lastUpdateRef.current = now;

        // Now begin ticking
        setIsRunning(true);
    }

    /**
     * Pauses the stopwatch, storing the current time.
     */
    function stop() {
        if (!isRunning) return;
        setIsRunning(false);

        const now = new Date();
        callbacksRef.current.onPause?.(
            now,
            elapsedMsRef.current,
            startTimeRef.current
        );
    }

    /**
     * Resets everything to start from zero again and invokes the reset callback.
     */
    function reset() {
        const now = new Date();
        callbacksRef.current.onReset?.(
            now,
            elapsedMsRef.current,
            startTimeRef.current
        );

        // Reset local states
        setElapsedMs(0);
        elapsedMsRef.current = 0;
        setIsRunning(false);
        setIsStarted(false);

        // Reset references
        startTimeRef.current = new Date();
        lastUpdateRef.current = new Date();

        // Rebuild events array from scratch
        eventsRef.current = callbacksRef.current.onTickEvents
            ? sortAndFilterEvents(callbacksRef.current.onTickEvents, 0)
            : [];
    }

    return {
        elapsedMs, // in ms
        isRunning, // boolean
        isStarted, // boolean
        start,
        stop,
        reset,
    };
}

/**
 * Helper: sort the events descending by timeElapsed,
 * then remove those that already should have been triggered.
 */
function sortAndFilterEvents(events: TimerEvent[], currentMs: number) {
    // Sort descending by time
    let sorted = [...events].sort((a, b) => b.timeElapsed - a.timeElapsed);

    // Remove any that are below the current elapsed Ms
    while (sorted.length && sorted[sorted.length - 1].timeElapsed < currentMs) {
        sorted.pop();
    }

    return sorted;
}
