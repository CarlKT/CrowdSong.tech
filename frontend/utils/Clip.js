const audio_record = document.querySelector('.record');
const audio_stop = document.querySelector('.stop');
const audio_play = document.querySelector('.play');

//* some constants that may be useful later
// const playhead = document.querySelector('.playhead');
// const armed = document.querySelector('.armed');

audio_stop.disabled = true;


class Clip {
    
    constructor(track) {
        this.track=track;
    }

    record_clip() {
        console.log("Abstract class was called");
    }

    play() {
        
    }
}

class AudioClip extends Clip{
    
    constructor(track, record) {
        this.track = track;
        this.chunks = [];
        // this.disabled = true;
        // track.on_arm = function(e) {
        //     this.disabled = false;
        // }
        
    }

   

    // Override
    record_clip() {
        
    }

    play() {

    }
}