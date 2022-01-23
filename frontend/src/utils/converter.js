const secondsToBar = (seconds, bpm, timesig) => {
    return (timesig * 60 / bpm) * seconds;
}

const barToSeconds = (bars, bpm, timesig) => {
    if (bars === 0) return 0;
    return bars * (timesig * (60 / bpm))
}

export { secondsToBar, barToSeconds};