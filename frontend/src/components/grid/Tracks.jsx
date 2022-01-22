import { Component } from "react";
import Track from "./Track.jsx";

class Tracks extends Component {
    render () {
        return <div className="grid grid-rows-4">
            <Track />
            <Track />
            <Track />
        </div>
    }
}

export default Tracks;