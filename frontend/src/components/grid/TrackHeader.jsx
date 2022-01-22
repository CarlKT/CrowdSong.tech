import { Component } from "react";
import "./TrackHeader.css";

class TrackHeader extends Component {
    render() {
        return <div className={`track-header ${this.props.selectedTrack === this.props.i ? "selected" : "" }`}
                    onClick={() => this.props.selectTrack(this.props.i)}
                >
        </div>
    }
}

export default TrackHeader;