import Tracks from "../components/grid/Tracks";
import Song from "./song.js";

// Create the Oscillators
class Oscillator{
    constructor(ctx){
        this.osc = ctx.createOscillator();
    }
    setOscType(type){
        this.osc.type = type;
    }
    setOscFrequency(freq, time){
        this.osc.frequency.setTargetAtTime(freq, 0, time);
    }
    oscStart(pos){
        this.osc.start(pos);
    }
    oscStop(pos){
        this.osc.stop(pos);
    }
    oscConnect(i){
        this.osc.connect(i);
    }
    oscCancel(){
        this.osc.frequency.cancelScheduledValues(0);
    }
}

// Create the AMP
class AMP{
    constructor(ctx){
        this.gain = ctx.createGain();
    }
    setVolume(volume, time){
        this.gain.gain.setTargetAtTime(volume, 0, time);
    }
    connect(i){
        this.gain.connect(i);
    }
    cancel(){
        this.gain.gain.cancelScheduledValues(0);
    }
    disconnect(){
        this.gain.disconnect(0);
    }
}

// recorder
class midiRecorder {
    constructor(){
        console.log(Song);
        this.audioContext = null;
        this.fuleReader = new FileReader();

        this.bpm = 120;
        this.playhead = 0;

        this.inputRecorder = null;
        this.chunks = [];

        this.song = new Song();
    }

    createContext(){
        this.audioContext = new AudioContext();
        this.audioContext.suspend();
    }


    async createInput(input) {
        let inputStream = this.audioContext.createMediaStreamDestination();

        this.inputRecorder = new MediaRecorder(inputStream);
        this.inputRecorder.addEventListener("dataavailable", (event) => {this.chunks.push(event.data); console.log(this.chunks)});
        this.inputRecorder.onstop = async (e) => {
            const blob = new Blob(this.chunks, {type : this.inputRecorder.mimeType});

            this.chunks = [];

            this.song.addAudioClip(this.playhead, this.selectedTrack, await blob.text());
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
