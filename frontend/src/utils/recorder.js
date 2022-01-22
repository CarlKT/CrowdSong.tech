
class Recorder {
    constructor() {
        this.audioContext = null;
        this.fileReader = new FileReader()

        this.bpm = 120;

        this.inputRecorder = null;
        this.chunks = [];
    }

    createContext() {
        this.audioContext = new AudioContext();
        this.audioContext.suspend();
    }

    async createInput(input) {
        if (!input) {
            const inputStream = await navigator.mediaDevices.getUserMedia({audio: true});
            this.inputRecorder = new MediaRecorder(inputStream);
            this.inputRecorder.addEventListener("dataavailable", this.recordingDone)
        } else {
            const inputStream = await navigator.mediaDevices.getUserMedia({audio: {
                devideId: input
            }});
            this.inputRecorder = new MediaRecorder(inputStream);
            this.inputRecorder.addEventListener("dataavailable", (event) => {this.chunks.push(event);})
        }
    }

    // TODO: time start & stop with metronome
    startRecordingInput() {
        this.chunks = [];
        this.inputRecorder.start();
    }

    stopRecordingInput() {
        this.inputRecorder.stop();
    }

    async getAudioInputs() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === "audioinput");
    }
}


export default Recorder;