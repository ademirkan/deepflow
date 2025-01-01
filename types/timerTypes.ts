// The distinct types of timers available
export type TimerType = "countdown" | "stopwatch";

// The possible statuses a timer can have
export type TimerStatus = "initial" | "running" | "paused";

// Configuration specific to a countdown timer
export interface CountdownConfig {
    // For example, how many seconds to count down from
    initialDuration: number;
}

// Configuration specific to a stopwatch timer
export interface StopwatchConfig {
    // For example, a flag indicating if the stopwatch should auto-start when created
    autoStart?: boolean;
}

// Base properties that all timers share
interface BaseTimer {
    id: string;
    ownerId: string;
    elapsedTime: number; // elapsed time in seconds
    status: TimerStatus;
    since: Date;
}

// A discriminated union that defines timers based on their type
export type Timer =
    | (BaseTimer & {
          timerType: "countdown";
          timerConfig: CountdownConfig;
      })
    | (BaseTimer & {
          timerType: "stopwatch";
          timerConfig: StopwatchConfig;
      });

export interface TimerRepository {
    getTimer(id: string): Promise<Timer>;
    setTimer(id: string, timer: Timer): Promise<void>;
    subscribeToTimer(id: string, callback: (timer: Timer) => void): void;
    unsubscribeFromTimer(id: string, callback: (timer: Timer) => void): void;
}
