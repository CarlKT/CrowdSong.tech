import { Component } from "react";
import ControlStrip from "./controls/ControlStrip";
import Grid from "./grid/Grid";

import Recorder from "../utils/recorder";
import Song from "../utils/song";

class DAW extends Component {
    constructor(props) {
        super(props);
    
        this.changeBPM = this.changeBPM.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.recordHandler = this.recordHandler.bind(this);


        this.state = {
            bpm: 120,
            recording: false,
            playing: false,
        };
    }

    componentDidMount() {
        this.song = new Song();
        this.recorder = new Recorder(this.song);
        this.recorder.loadSong();
        this.recorder.createInput();
        this.recorder.getAudioInputs().then(inputs => this.setState({audioInputs: inputs}));
    }

    recordHandler() {
        if (this.state.recording) {
            this.recorder.stopRecordingInput();
            this.setState({recording: false})
        } else {
            this.recorder.startRecordingInput();
            this.setState({recording: true})
        }
    }

    playHandler() {
        if (this.state.playing) {
            this.recorder.stopPlaying();
            this.setState({playing: false})
        } else {
            this.recorder.startPlaying();
            this.setState({playing: true})
        }
    }

    changeBPM(bpm) {
        this.setState({bpm});
        this.recorder.bpm = bpm;
        this.song.bpm = bpm;
    }

    render() {
        return <div>
            <ControlStrip recordHandler={this.recordHandler} playHandler={this.playHandler} changeBPM={this.changeBPM} inputs={this.state.audioInputs} recorder={this.recorder}/>
            <Grid tracks={4} bpm={this.state.bpm} recording={this.state.recording} playing={this.state.playing} recorder={this.recorder} song={this.song}/>
        </div>
    }
}

export default DAW;