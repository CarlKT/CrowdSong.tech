import { Component } from "react";
import TrackHeader from "./TrackHeader";

class Track extends Component {
    render() {
        return <div className="flex w-full m-1">
            <TrackHeader />
            <div className="border-solid border-black h-10 w-fit bg-blue-300"></div>
        </div>

    }
}

export default Track;