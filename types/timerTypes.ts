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

export type TimerConfig = CountdownConfig | StopwatchConfig;

// A discriminated union that defines timers based on their type
export type TimerState =
    | {
          id: string;
          ownerId: string;
          elapsedTime: number; // elapsed time in seconds
          status: TimerStatus;
          since: Date;
          type: "countdown";
          config: CountdownConfig;
      }
    | {
          id: string;
          ownerId: string;
          elapsedTime: number; // elapsed time in seconds
          status: TimerStatus;
          since: Date;
          type: "stopwatch";
          config: StopwatchConfig;
      };

export interface TimerRepository {
    getTimer(id: string): Promise<TimerState>;
    setTimer(id: string, timer: TimerState): Promise<void>;
    subscribeToTimer(id: string, callback: (timer: TimerState) => void): void;
    unsubscribeFromTimer(
        id: string,
        callback: (timer: TimerState) => void
    ): void;
}
