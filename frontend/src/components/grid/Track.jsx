import { Component, useRef, useEffect } from "react";
import TrackHeader from "./TrackHeader";

class Track extends Component {
    render() {
        return <div className="w-full my-1">
            <div className="flex h-24 w-full">
                <TrackHeader />
                <div className="h-full w-full bg-slate-100"></div>
            </div>
        </div>

    }
}

export default Track;