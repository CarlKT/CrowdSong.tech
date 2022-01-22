import { Component, useRef, useEffect } from "react";
import Clip from "./Clip";
import "./Track.css";

class Track extends Component {
    render() {
        return <div className="track">
            {this.props.clips.map(clip => <Clip width={clip.width} start={clip.start} />)}
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