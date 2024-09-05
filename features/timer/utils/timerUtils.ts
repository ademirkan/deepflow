/**
 * Returns formatted time (M)MM:SS
 * @param {int} seconds
 */
export function formatTime(time: number) {
    let seconds = time / 1000;

    seconds = Math.round(seconds); // incase seconds is not a whole integer
    const minutes = Math.floor(seconds / 60);
    let minuteString = minutes.toString();
    if (minutes < 10) minuteString = "0" + minuteString;

    const minuteSeconds = seconds % 60;
    let minuteSecondsString = minuteSeconds.toString();
    if (minuteSeconds < 10) minuteSecondsString = "0" + minuteSecondsString;
    return minuteString + ":" + minuteSecondsString;
}
