const audio_record = document.querySelector('.record');
const audio_stop = document.querySelector('.stop');
const audio_play = document.querySelector('.play');
const audio_permission = document.querySelector('.permission');

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

// recorder class
class recordMIDI{
    constructor(context){
        this.ctx = context;
        console.log("Constructor!");
        console.log(this.ctx);
        console.log("Destination!");
        console.log(this.ctx.destination);
        // this.recorderNode = this.ctx.getMediaStreamDestination();
        // this.recorderNode = MediaStreamAudioDestinationNode.MediaStreamAudioDestinationNode();
        this.recorderNode = this.ctx.createMediaStreamDestination();

        this.activeNotes = [];

        this.settings = {
            attack: 0.05,
            release: 0.05,
            portamento: 0.05,
        };
    }
    // Connected to MIDI
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
        this.osc1 = new Oscillator(this.ctx);
        this.osc1.setOscType('sine');

        // this.gain  = this.ctx.createGain();
        this.amp = new AMP(this.ctx);

        this.osc1.oscConnect(this.amp.gain);
        this.amp.connect(this.ctx.destination);
        this.amp.connect(this.recorderNode);
        this.amp.setVolume(0.0,0);

        this.osc1.oscStart(0);

    }
    mtof(note){
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    noteOn(note, velocity){
        this.activeNotes.push(note);

        this.osc1.oscCancel();
        this.currentFreq = this.mtof(note);
        this.osc1.setOscFrequency(this.currentFreq, this.settings.portamento);

        this.amp.cancel();

        this.amp.setVolume(1.0, this.settings.attack);
    }
    noteOff(note){
        var position = this.activeNotes.indexOf(note);
        if (position !== -1){
            this.activeNotes.splice(position, 1);
        }
        if (this.activeNotes.length == 0){
            this.amp.cancel();
            this.currentFreq = null;
            this.amp.setVolume(0.0, this.settings.release);
        } else {
            this.osc1.oscCancel();
            this.currentFreq = this.mtof(this.activeNotes[this.activeNotes.length - 1]);
            this.osc1.setOscFrequency(this.currentFreq, this.settings.portamento);
        }
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
    recorder(){

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
    record(){
        if (this.connectedMIDI()){
            console.log("MIDI Connected!");
            this.Engine();
            console.log("Engine running...");
            // navigator.mediaDevices.getUserMedia({ audio:true }).then(stream => this.recordMIDI(stream));
            this.recorder(this.recorderNode.stream);
        } else {
            console.log("No MIDI detected :( ");
        }
    }
}


// var audioCtx = new AudioContext();
function getAudioContext() {
    return new Promise((resolve, reject) => { 
        resolve(
            new (window.AudioContext || window.webkitAudioContext)()
        )
        reject(
            "Your browser rejected a request to access the Web Audio API, a required component"
        )
    }
                      );
}

audio_permission.onclick = function(){

    // var audioCtx = new window.AudioContext();
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    var midi_recorder = new recordMIDI(audioCtx);
    midi_recorder.record();

}

