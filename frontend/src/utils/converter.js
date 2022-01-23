const secondsToBar = (seconds, bpm, timesig) => {
    return (timesig * 60 / bpm) * seconds;
}

const barToSeconds = (bars, bpm, timesig) => {
    return bars / (timesig * 60 / bpm)
}

export { secondsToBar, barToSeconds};