import { Component, useRef, useEffect } from "react";
import Clip from "./Clip";
import "./Track.css";

class Track extends Component {
    render() {
        const clips = [];
        for (let i in this.props.clips) {
            clips.push(<Clip key={i} start={this.props.clips[i].start} width={this.props.clips[i].width}></Clip>)
        }
        return <div className="track">
            {clips}
            {this.props.i === this.props.selectedTrack ? 
                <div className="bg-cyan-600 absolute h-full"
                    style={{
                        transform: "translateX(" + this.props.playheadPosition + "px)", 
                        width: !this.props.recording ? "0px" : "calc(100% - " + this.props.playheadPosition + "px)",
                        transitionProperty: "width",
                        transitionDuration: !this.props.recording ?  "0s" : (4096 - this.props.playheadPosition)/(this.props.bpm * 16) * 60 + "s",
                        transitionTimingFunction: "linear",
                    }}
                ></div> : ""
            }
        </div>

    }
}

export default Track;