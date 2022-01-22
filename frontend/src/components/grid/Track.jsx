import { Component } from "react";
import TrackHeader from "./TrackHeader";

class Track extends Component {
    render() {
        return <div className="w-full m-1">
            <div className="flex h-24 w-full">
                <TrackHeader />
                <div className="h-full w-full bg-blue-300"></div>
            </div>
        </div>

    }
}

export default Track;