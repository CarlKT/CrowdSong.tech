import Tracks from "../components/grid/Tracks";
import Song from "./song.js";

class Recorder {
    constructor() {
        console.log(Song);
        this.audioContext = null;
        this.fileReader = new FileReader()

        this.bpm = 120;
        this.playhead = 0;

        this.inputRecorder = null;
        this.chunks = [];

        this.song = new Song();
    }

    createContext() {
        this.audioContext = new AudioContext();
        this.audioContext.suspend();
    }

    async createInput(input) {
        let inputStream;
        if (!input) {
            inputStream = await navigator.mediaDevices.getUserMedia({audio: true});
        } else {
            inputStream = await navigator.mediaDevices.getUserMedia({audio: {
                devideId: input
            }});
        }
        this.inputRecorder = new MediaRecorder(inputStream);
        this.inputRecorder.addEventListener("dataavailable", (event) => {this.chunks.push(event.data); console.log(this.chunks)});
        this.inputRecorder.onstop = async (e) => {
            const blob = new Blob(this.chunks, { type: this.inputRecorder.mimeType}); 
//            const buffer = await this.audioContext.decodeAudioData(await blob.arrayBuffer());

            this.chunks = [];

            this.song.addAudioClip(this.playhead, this.selectedTrack, await blob.text());
            //const sampleSource = this.audioContext.createBufferSource();
            //sampleSource.buffer = buffer;
            //sampleSource.connect(this.audioContext.destination)
            //sampleSource.start(this.audioContext.currentTime + 2);

            //this.audioContext.resume();
        };
    }

    // TODO: time start & stop with metronome
    startRecordingInput() {
        this.inputRecorder.start();
    }

    stopRecordingInput() {
        this.inputRecorder.stop();
    }

    async getAudioInputs() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === "audioinput");
    }

    async loadSong() {
    }

    movePlayHead(i) {
        this.playhead = i;
    }
}


export default Recorder;