const audio_record = document.querySelector('.record');
const audio_stop = document.querySelector('.stop');
const audio_play = document.querySelector('.play');

//* some constants that may be useful later
// const playhead = document.querySelector('.playhead');
// const armed = document.querySelector('.armed');

audio_stop.disabled = true;


class Clip {
    
    constructor(track, start_pos, name) {
        this.track = track;
        this.start_pos = start_pos;
        this.name = name;
        this.to_string = "Clip " + name + 
            "at " + this.track.id + ": " + this.start_pos;
    }

    record_clip() {
        console.log("Abstract class was called");
    }

    play() {

    }
}

class AudioClip extends Clip{
    
    constructor(track, start_pos, name) {
        this.track = track;
        this.start_pos = start_pos;
        this.name = name;
        if (navigator.mediaDevices.getUserMedia({ audio: true })) {
            console.log('getUserMedia supported.');

            this.chunks = [];
            this.mediaRecorder = new MediaRecorder(stream);
        }
        this.to_string = "Clip " + name + 
            "at " + this.track.id + ": " + this.start_pos;
    }

    // Override
    start() {
        console.log("Started recording clip in track " + this.track.id);

        this.mediaRecorder.start();
        this.mediaRecorder.addEventListener("dataavailable", event => {
            this.chunks.push(event.data);
        })
    }

    stop() {
        console.log("Recording stopped");

        mediaRecorder.stop();
    }

    play() {
        console.log("Preparing and playing audio")
        const blob = new Blob(this.chunks);
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    }
}