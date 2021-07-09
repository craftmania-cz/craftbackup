
export const convertMsToTime = (millis: number): string => {
    let minutes: number = Math.floor(millis / 60000);
    let seconds: number = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' + seconds : seconds);
}
