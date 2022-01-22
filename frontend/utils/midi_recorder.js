// check if a MIDI Device is connected
function connectedMIDI(){
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

class recordMIDI {
    constructor(props) {
        this.midiNotes=[];
        this.state={
            selectedInstrument : 1
            ,status:'?'
        };
    }
    componentDidMount(){
        this.envelopes=[];
        this.startListening();
    }
    keyDown(n,v){
        this.keyUp(n);
        var volume=1;
        if (v){
            volume=v;
        }
        this.envelopes[n]=this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
			                                                          , this.midiSounds.equalizer.input
			                                                          , window[this.midiSounds.player.loader.instrumentInfo(this.state.selectedInstrument).variable]
			                                                          , 0, n, 9999,volume);
		    this.setState(this.state);
    }
    keyUp(n){
        if(this.envelopes){
            if(this.envelopes[n]){
                this.envelopes[n].cancel();
                this.envelopes[n]=null;
                this.setState(this.state);
            }
        }
    }
    pressed(n){
        if(this.envelopes){
            if(this.envelopes[n]){
                return true;
            }
        }
        return false;
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
			      this.keyDown(pitch, velocity/127);
			      break;
		    case 128:
			      this.keyUp(pitch);
			      break;
		    }
	  }

}
