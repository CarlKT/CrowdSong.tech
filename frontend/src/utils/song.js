import { secondsToBar } from "./converter";

class Song {
    constructor() {
        this.title = "Untitled";
        this.code = "";
        this.bpm = 120;
        this.tracks = {};

        this.subscribers = [];

        this.getClips = this.getClips.bind(this);
    }

    loadFromJSON(json) {
        // TODO:

        this.changed();
    }

    getTracks() {

    }

    getClips(track) {
        return this.clips.filter(clip => clip.track === track);
    }

    getAllClips() {
        return this.tracks;
    }

    addAudioClip(start, width, track, blob) {
        if (this.tracks[track]) {
            this.tracks[track].push({start, width: secondsToBar(width, this.bpm, 4), data: blob});
        } else {
            this.tracks[track] = [{start, width: secondsToBar(width, this.bpm, 4), data: blob}];
        }

        this.changed();
    }

    onChange(callback) {
        this.subscribers.push(callback);
    }

    changed() {
        this.subscribers.forEach(m => m());
    }
}

export default Song;