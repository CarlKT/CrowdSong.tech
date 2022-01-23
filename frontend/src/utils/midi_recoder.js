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

    connectedMIDI(){
        if (typeof navigator.requestMIDIAccess === "function"){
            if (navigator.requestMIDIAccess){
                navigator.requestMIDIAccess().then(midiAccess => {
                    Array.from(midiAccess.inputs).forEach(input => {
                        input[1].onmidimessage = (msg) => {
                            this.midiOnMIDImessage(msg);}
                    })
                });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    Engine(){
        // this.osc1 = new Oscillator(this.ctx);
        // this.osc1.setOscType('sine');

        this.osc_dict = {};
        this.amp_dict = {};

        this.active_oscs = 0;
        this.active_oscs_arr = [];

        for (let i = 21; i<108; i++){
            this.osc_dict[i] = new Oscillator(this.ctx);
            this.osc_dict[i].setOscType('sine');
            this.osc_dict[i].setOscFrequency(this.mtof(i), this.settings.portamento);
            this.amp_dict[i] = new AMP(this.ctx);
            this.osc_dict[i].oscConnect(this.amp_dict[i].gain);
            this.amp_dict[i].connect(this.ctx.destination);
            this.amp_dict[i].connect(this.recorderNode);
            this.amp_dict[i].setVolume(0.0,0);

            this.osc_dict[i].oscStart(this.ctx.currentTime);
        }

        // this.port_osc = new Oscillator(this.ctx);
        // this.port_osc.setOscType('sine');
        // this.port_amp = new AMP(this.ctx);
        // this.port_osc.oscConnect(this.port_amp);
        // this.port_amp.connect(this.ctx.destination);
        // this.port_amp.connect(this.recorderNode);
        // this.port_amp.setVolume(1.0,0);

    }

    mtof(note){
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    createContext(){
        this.audioContext = new AudioContext();
        this.audioContext.suspend();
    }

    noteOn(note, velocity){
        this.activeNotes.push(note);

        // this.osc1.oscCancel();
        // this.currentFreq = this.mtof(note);
        // this.osc1.setOscFrequency(this.currentFreq, this.settings.portamento);

        // this.amp.cancel();

        this.active_oscs += 1;
        this.active_oscs_arr.push(note);
        for (var i=0; i < this.active_oscs; i++){
            this.amp_dict[this.active_oscs_arr[i]].gain.value = 1/(this.active_oscs + 0.1);
            this.amp_dict[this.active_oscs_arr[i]].setVolume(0.75/(this.active_oscs + 0.1), this.settings.attack);
            console.log(this.amp_dict[this.active_oscs_arr[i]].gain.value);
        }
        // this.amp_dict[note].setVolume(0.5, this.settings.attack);
    }
    noteOff(note){
        // var position = this.activeNotes.indexOf(note);
        // if (position !== -1){
        //     this.activeNotes.splice(position, 1);
        // }
        // if (this.activeNotes.length == 0){
        //     this.amp_dict[note].cancel();
        //     this.amp_dict[note].setVolume(0.0, this.settings.release);
        // } else {
        //     this.osc_dict[note].oscCancel();
        //     this.currentFreq = this.mtof(this.activeNotes[this.activeNotes.length - 1]);
        //     // this.port_osc.setOscFrequency(this.currentFreq, this.settings.portamento);
        // }
        this.active_oscs -= 1;
        var index_to_remove = this.active_oscs_arr.indexOf(note);
        if (index_to_remove > -1) {
            this.active_oscs_arr.splice(index_to_remove, 1);
        }
        this.amp_dict[note].setVolume(0.0, this.settings.attack);
    }

    midiOnMIDImessage(event){
        var data = event.data;
        // var cmd = data[0] >> 4;
        // var channel = data[0] & 0xf;
        var type = data[0] & 0xf0;
        var pitch = data[1];
        var velocity = data[2];
        switch (type) {
        case 144:
            this.noteOn(pitch, velocity/127);
            console.log(this.mtof(pitch));
            break;
        case 128:
            this.noteOff(pitch);
            console.log("Released");
            break;
        }
    }

    async createInput(input) {
        let inputStream = this.audioContext.createMediaStreamDestination();

        if (this.connectedMIDI()){
            this.Engine();
        }

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
