class Song {
    constructor() {
        this.song = {
            title: "Untitled",
            code: "",
            clips: []
        };
    }

    loadFromJSON(json) {
        this.song = JSON.parse(json);
    }

    getTracks() {

    }

    getClips(track) {
        return this.song.clips.filter(clip => clip.track === track);
    }

    getAllClips() {
        return this.song.clips;
    }

    addAudioClip(time, track, blob) {
        this.song.clips.push({start: time, track, data: blob})
    }
}

export default Song;