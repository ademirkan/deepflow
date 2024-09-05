import { TimerEvent } from "./TimerEvent";

/**
 * Timer callbacks type
 */
export type TimerCallbacks = {
    onStart?: (now: Date, elapsedSeconds?: number) => void; // called on initial timer start
    onTick?: (now: Date, elapsedSeconds: number, startTime: Date) => void; // called on each tick interval
    onResume?: (now: Date, elapsedSeconds: number, startTime: Date) => void; // called on each subsequent resume
    onPause?: (now: Date, elapsedSeconds: number, startTime: Date) => void; // called on each timer pause
    onReset?: (now: Date, elapsedSeconds: number, startTime: Date) => void; // called on timer reset
    onTickEvents?: Array<TimerEvent>; // scheduled timer events: (time, callback)
};
