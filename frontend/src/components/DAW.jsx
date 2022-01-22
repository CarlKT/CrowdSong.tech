import { Component } from "react";
import ControlStrip from "./controls/ControlStrip";
import Grid from "./grid/Grid";

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

    recordHandler() {
        if (this.state.recording) {

            this.setState({recording: false})
        } else {

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
            <ControlStrip recordHandler={this.recordHandler} playHandler={this.playHandler} changeBPM={this.changeBPM} />
            <Grid tracks={4} bpm={this.state.bpm} recording={this.state.recording} playing={this.state.playing}/>
        </div>
    }
}

export default DAW;