import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { Timer, TimerRepository } from "@/types/timer";

export class FirebaseTimerRepository implements TimerRepository {
    async getTimer(id: string): Promise<Timer> {
        const timerDoc = doc(db, "timers", id);
        const timer = await getDoc(timerDoc);
        return timer.data() as Timer;
    }

    async setTimer(id: string, timer: Timer): Promise<void> {
        const timerDoc = doc(db, "timers", id);
        const timerData = { ...timer };
        await updateDoc(timerDoc, timerData);
    }

    async subscribeToTimer(
        id: string,
        callback: (timer: Timer) => void
    ): Promise<void> {
        const timerDoc = doc(db, "timers", id);
        const unsubscribe = onSnapshot(timerDoc, (doc) => {
            callback(doc.data() as Timer);
        });
    }

    async unsubscribeFromTimer(
        id: string,
        callback: (timer: Timer) => void
    ): Promise<void> {
        const timerDoc = doc(db, "timers", id);
        const unsubscribe = onSnapshot(timerDoc, (doc) => {
            callback(doc.data() as Timer);
        });
    }
}
