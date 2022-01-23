const audio_permission = document.querySelector('.permission');
// const audio_record = document.querySelector('.record');
// const audio_stop = document.querySelector('.stop');
// const audio_play = document.querySelector('.play');
// import { barToSeconds } from "./converter"

// Helper methods for synthesizing sound
class Oscillator{
    constructor(ctx){
        this.osc = ctx.createOscillator();
    }
    setOscType(type){
        this.osc.type = type;
    }
    setOscFrequency(freq, time){
        this.osc.frequency.setTargetAtTime(freq, 0., time);
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
class Amp{
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

function midi_to_freq(midi_in) {
    return 440 * Math.pow(2, (midi_in - 69) / 12);
}


class MidiRecorder {
    constructor(song) {
        this.audioContext = null;
        this.fileReader = new FileReader()

        this.bpm = 120;
        this.playhead = 0;

        this.inputRecorder = null;

        this.chunks = [];
        this.activeNotes = [];

        this.settings = {
            attack: 0.05,
            release: 0.05,
            portamento: 0.05,
        };

        this.recordedTime = 0;
        this.selectedTrack = 0;

        this.song = song;
    }

    createContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("Context created, building synth...");
        
        this.recorderNode = this.audioContext.createMediaStreamDestination();
        this.prepMidi(this.audioContext);
        this.audioContext.suspend();
        
        console.log("Building synth done.");
    }

    async createInput(input) {
        let inputStream;
        if (!input) {
            inputStream = await navigator.mediaDevices.getUserMedia({audio: true});
        } else {
            inputStream = await navigator.mediaDevices.getUserMedia({audio: {
                deviceId: input
            }});
        }

        this.inputRecorder = new MediaRecorder(this.recorderNode.stream);
        
        console.log("recording started");
        this.inputRecorder.addEventListener("dataavailable", event => {
            chunks.push(event.data);
        });
        this.inputRecorder.onstop = async (e) => {
            this.recordedTime = this.audioContext.currentTime - this.recordedTime;
            const blob = new Blob(this.chunks, { type: this.inputRecorder.mimeType}); 

            this.song.addAudioClip(this.playhead, this.recordedTime, this.selectedTrack, await blob.arrayBuffer());


            this.chunks = [];
            this.recordedTime = 0;

            await this.loadSong()
        };
    }

    build_components(ctx) {
        this.osc_dict = {};
        this.amp_dict = {};

        this.active_oscs = 0;
        this.active_oscs_arr = [];

        for (let i = 21; i<108; i++){
            let osc = new Oscillator(ctx);
            let amp = new Amp(ctx);

            osc.setOscType('sine');
            osc.setOscFrequency(midi_to_freq(i), this.settings.portamento);
            amp.setVolume(0.0,0);

            osc.oscConnect(amp.gain);
            osc.oscStart(ctx.currentTime);
            
            // console.log(this.recorderNode);
            amp.connect(ctx.destination);
            amp.connect(this.recorderNode);

            this.osc_dict[i] = osc;
            this.amp_dict[i] = amp;
        }
    }

    // Check if MIDI is properly connected
    connectedMIDI() {
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

    prepMidi(ctx) {
        if (this.connectedMIDI()){
            console.log("MIDI Connected!");
            this.build_components(ctx);
            console.log("Engine running...");
            this.recorder(this.recorderNode.stream);
        } else {
            console.log("No MIDI detected :( ");
        }
    }

    // Change midi note state
    noteOn(note) {
        this.activeNotes.push(note);

        this.active_oscs += 1;
        this.active_oscs_arr.push(note);
        for (let i=0; i < this.active_oscs; i++){
            let amp = this.amp_dict[this.active_oscs_arr[i]];

            amp.gain.value = 1/(this.active_oscs + 0.1);
            amp.setVolume(0.75/(this.active_oscs + 0.1), this.settings.attack);
            console.log(amp.gain.value);
        }
    }

    noteOff(note) {
        this.active_oscs -= 1;
        var index_to_remove = this.active_oscs_arr.indexOf(note);
        if (index_to_remove > -1) {
            this.active_oscs_arr.splice(index_to_remove, 1);
        }
        this.amp_dict[note].setVolume(0.0, this.settings.attack);
    }

    midiOnMIDImessage(event) {
        var data = event.data;  var type = data[0] & 0xf0;
        var pitch = data[1];    var velocity = data[2];

        switch (type) {
            case 144:
                this.noteOn(pitch, velocity/127);
                console.log(midi_to_freq(pitch));
                break;
            case 128:
                this.noteOff(pitch);
                console.log("Released");
                break;
        }
    }

    //! DEPRECATED: integrate into createInput
    recorder() {

        var stream = this.recorderNode.stream;

        let chunks = [];
        let mediaRecorder = new MediaRecorder(stream);

        audio_record.onclick = function() {
            // Optional count_in feature
            // count_in.start();
            console.log("Recording...");
            mediaRecorder.start();
            
            // playhead.start();
            audio_stop.disabled = false;
            audio_record.disabled = true;
            audio_record.style.background = "red";

            setTimeout(() => {
                mediaRecorder.stop();
                
                audio_stop.disabled = true;
                audio_record.disabled = false;
                
                audio_record.style.background = "";
                audio_record.style.color = "";
            }, 3000);   //* Dummy value, to change later
        }

        audio_stop.onclick = function() {
            mediaRecorder.stop();
            console.log("Recording stopped...");

            // playhead.stop();
            audio_stop.disabled = true;
            audio_record.disabled = false;
            audio_record.style.background = "";
            audio_record.style.color = "";
        }

        mediaRecorder.addEventListener("dataavailable", event => {
            chunks.push(event.data);
        })

        // mediaRecorder.onstop = function(e) {
        //     const blob = new Blob(chunks);
        //     const audioUrl = URL.createObjectURL(blob);
        //     const audio = new Audio(audioUrl);
        //     audio.play();
        // }

        audio_play.onclick = function () {
            console.log("Preparing and playing audio");
            const blob = new Blob(chunks);
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
            console.log("done playing audio");
        }

    }


    // Copied from recorder.js
    startRecordingInput() {
        this.inputRecorder.start();
        this.audioContext.resume();
        this.recordedTime = this.audioContext.currentTime;
    }

    stopRecordingInput() {
        this.inputRecorder.stop();
        this.audioContext.suspend();
    }

    startPlaying() {
        this.audioContext.resume();
    }

    stopPlaying() {
        this.audioContext.suspend();
        this.loadSong();
    }

    async getAudioInputs() {
        let devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === "audioinput");
    }

    async loadSong() {
        for (let i in this.song.tracks) {
            for (let l in this.song.tracks[i]) {
                const clip = this.song.tracks[i][l];

                if (clip.start >= this.playhead) {
                    const blob = new Blob([clip.data], {type: this.inputRecorder.mimeType});
                    const buffer = await this.audioContext.decodeAudioData(await blob.arrayBuffer());
                    const sampleSource = this.audioContext.createBufferSource();
                    sampleSource.buffer = buffer;
                    sampleSource.connect(this.audioContext.destination)
                    sampleSource.start(this.audioContext.currentTime + barToSeconds(clip.start - this.playhead, this.bpm, 4)); 
                }
           }
        };
    }

    getClips(i) {
        return this.song.getClips(i);
    }

    movePlayHead(i) {
        this.playhead = i;
        this.loadSong();
    }

    skipPlayHead(i) {
        this.playhead = i;
        this.inputRecorder.stop();
        this.audioContext.suspend();
    }
}

function main() {
    audio_permission.onclick = function(){

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
        var midi_recorder = new MidiRecorder("test");

        midi_recorder.createContext();
        midi_recorder.createInput(true);
        // midi_recorder.record();
    
    }
}


main();