// check if a MIDI Device is connected

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

class recordMIDI{
    constructor(context){
        this.ctx = context;
    }
    // Connected to MIDI
    connectedMIDI(){
        if (typeof navigator.requestMIDIAccess === "function"){
            if (navigator.requestMIDIAccess){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // Audio Context
    // createContext(){
    //     this.ctx = new AudioContext();
    // }
    // Audio Engine
    Engine(){
        this.osc1 = new Oscillator(this.ctx);
        this.osc1.setOscType('sine');

        this.ctx.createGain();
        this.amp = new Amp(this.ctx);

        this.osc1.connect(self.amp.gain);
        this.amp.connect(this.ctx.destination);
        this.amp.setVolume(0.0,0);
    }
    mtof(note){
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    noteOn(note, velocity){
        this.activeNotes.push(note);

        this.osc1.cancel();
        this.currentFreq = this.mtof(note);
        this.osc1.setFrequency(this.currentFreq, this.settings.portamento);

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
            this.osc1.cancel();
            this.currentFreq = this.mtof(this.activeNotes[this.activeNotes.length - 1]);
            this.osc1.setFrequency(this.currentFreq, this.settings.portamento);
        }
    }
    midiOnMIDImessage(event){
        var data = event.data;
        var cmd = data[0] >> 4;
        var channel = data[0] & 0xf;
        var type = data[0] & 0xf0;
        var pitch = data[1];
        var velocity = data[2];
        switch (type) {
        case 144:
            this.noteOff(pitch, velocity/127);
            break;
        case 128:
            this.noteOn(pitch);
            break;
        }
    }

}


