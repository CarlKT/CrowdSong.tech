import { Component } from "react";
import ControlStrip from "./controls/ControlStrip";
import Grid from "./grid/Grid";

import Recorder from "../utils/recorder";

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
        this.recorder = new Recorder();
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

            this.setState({playing: false})
        } else {

            this.setState({playing: true})
        }
    }

    changeBPM(bpm) {
        this.setState({bpm});
    }

    render() {
        return <div>
            <ControlStrip recordHandler={this.recordHandler} playHandler={this.playHandler} changeBPM={this.changeBPM} inputs={this.state.audioInputs} recorder={this.recorder}/>
            <Grid tracks={4} bpm={this.state.bpm} recording={this.state.recording} playing={this.state.playing} recorder={this.recorder}/>
        </div>
    }
}

export default DAW;