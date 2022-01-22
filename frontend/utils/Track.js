const clock = document.querySelector('.clock');
// const 

class Track {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.armed = false;
        
        //
        this.clips = {};
    }

    set_armed(bool) {
        this.armed = bool;
    }

    add_clip(clip) {
        this.clips[clip.start_pos] = clip;
    }

    // We want to add clock listeners to each clip for each track, then start the clock.
    play_track(start_time) {
        for (key in this.clips) {
            setTimeout(() => {
                this.clips[key].play();
            }, key);
        }
    }
}