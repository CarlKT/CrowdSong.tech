import { Component } from "react";
import PlayHead from "./PlayHead";
import Track from "./Track";
import "./Grid.css";
import TrackHeader from "./TrackHeader";
import RulerBar from "./RulerBar";


class Grid extends Component {
    constructor(props) {
        super(props);

        this.jumpPlayhead = this.jumpPlayhead.bind(this);
        this.selectTrack = this.selectTrack.bind(this);
        
        this.state = {
            playheadPosition: 0,
            selectedTrack: 0,
        }

        //this.props.recorder.song.onChange(this.updateTracks);
    }


    jumpPlayhead(i) {
        if (!this.props.recording && !this.props.playing) {
            this.props.recorder.movePlayHead(i - 1);
            this.setState({
                playheadPosition: (i - 1) * 64,
            });
        }
    }

    selectTrack(i) {
        if (!this.props.recording && !this.props.playing) {
            this.props.recorder.selectedTrack = i;
            this.setState({
                selectedTrack: i,
            });
        }
    }

    movePlayhead() {
    }

    render() {
        let rulerBars = [];
        for (let i = 1; i < 65; i++) {
            rulerBars.push(<RulerBar key={i} move={this.jumpPlayhead} i={i} />);
        }

        let trackHeaders = [];
        let gridTracks = [];
        for (let i = 0; i < this.props.tracks; i++) {
            trackHeaders.push(<TrackHeader key={i} i={i} selectTrack={this.selectTrack} selectedTrack={this.state.selectedTrack}/>)
            gridTracks.push(<Track 
                            key={i} i={i} 
                            selectedTrack={this.state.selectedTrack} 
                            recording={this.props.recording} 
                            clips={this.props.song ? this.props.song.tracks[i] : []} 
                            playheadPosition={this.state.playheadPosition}
                            bpm={this.props.bpm}
                        />)
        }
        return <div id="grid">
            <div id="grid-corner"></div>
            <div id="grid-ruler">
                {rulerBars}
            </div>
            <div id="grid-headers">
                {trackHeaders}
            </div>
            <div id="grid-tracks">
                <PlayHead x={this.state.playheadPosition} bpm={this.props.bpm} moving={this.props.playing || this.props.recording}/>
                {gridTracks}
            </div>
        </div>
    }
}

export default Grid;