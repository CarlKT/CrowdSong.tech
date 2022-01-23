import { barToSeconds } from "./converter"

class Recorder {
    constructor(song) {
        this.audioContext = null;
        this.fileReader = new FileReader()

        this.bpm = 120;
        this.playhead = 0;

        this.inputRecorder = null;
        this.chunks = [];
        this.recordedTime = 0;

        this.selectedTrack = 0;

        this.song = song;
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
        this.inputRecorder.addEventListener("dataavailable", (event) => {this.chunks.push(event.data)});
        this.inputRecorder.onstop = async (e) => {
            this.recordedTime = this.audioContext.currentTime - this.recordedTime;
            const blob = new Blob(this.chunks, { type: this.inputRecorder.mimeType}); 


            this.song.addAudioClip(this.playhead, this.recordedTime, this.selectedTrack, await blob.arrayBuffer());


            this.chunks = [];
            this.recordedTime = 0;
            //const sampleSource = this.audioContext.createBufferSource();
            //sampleSource.buffer = buffer;
            //sampleSource.connect(this.audioContext.destination)
            //sampleSource.start(this.audioContext.currentTime + 2);

            //this.audioContext.resume();

            await this.loadSong()
        };
    }

    // TODO: time start & stop with metronome
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


export default Recorder;