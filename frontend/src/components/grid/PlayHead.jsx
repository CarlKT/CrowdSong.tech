import { Component } from "react";

class PlayHead extends Component {
    render() {
        return <div className="absolute" style={{borderLeft: "2px solid black", height: this.props.height, left: this.props.position}}></div>
    }
}

export default PlayHead;