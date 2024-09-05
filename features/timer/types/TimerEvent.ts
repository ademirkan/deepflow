export type TimerEvent = {
    timeElapsed: number;
    callback: (now: Date, elapsedTime: number, startTime: Date) => void;
};
