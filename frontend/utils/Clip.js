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
            " at " + this.track.id + " : " + this.start_pos;
    }

    start() {
        throw "Error: Abstract class was called";
    }

    stop() {
        throw "Error: Abstract class was called";
    }

    play() {
        throw "Error: Abstract class was called";
    }
}

class AudioClip extends Clip {
    
    constructor(track, start_pos, name) {
        super(track,  start_pos, name);
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                console.log('getUserMedia supported.');
                this.mediaRecorder = new MediaRecorder(stream);
        });
            
        this.chunks = [];
    }

    // Override
    start() {
        this.chunks = [];
        console.log("Started recording " + this.to_string);

        this.mediaRecorder.start();
        this.mediaRecorder.addEventListener("dataavailable", event => {
            this.chunks.push(event.data);
        });
    }

    stop() {
        console.log("Recording " + this.to_string + " stopped");

        this.mediaRecorder.stop();
    }

    play() {
        console.log("Preparing and playing audio")
        const blob = new Blob(this.chunks);
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

function main() {
    const clip = new AudioClip("T1", "0:00", "hello world!")
    audio_record.onclick = function() {
        // Optional count_in feature
        // count_in.start();
        clip.start();
        
        // playhead.start();
        audio_stop.disabled = false;
        audio_record.disabled = true;
        audio_record.style.background = "red";

        setTimeout(() => {
            clip.stop();
            
            audio_stop.disabled = true;
            audio_record.disabled = false;
            
            audio_record.style.background = "";
            audio_record.style.color = "";
        }, 3000);   //* Dummy value, to change later
    }

    audio_stop.onclick = function() {
        clip.stop();

        // playhead.stop();
        audio_stop.disabled = true;
        audio_record.disabled = false;
        audio_record.style.background = "";
        audio_record.style.color = "";
    }

    audio_play.onclick = function() {
        clip.play();
    }
}

main();