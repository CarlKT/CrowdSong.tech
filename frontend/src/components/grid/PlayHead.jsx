import { Component } from "react";
import "./PlayHead.css";

class PlayHead extends Component {
    render() {
        let style = {};
        if (!this.props.moving) {
            style = {transform: "translate(" + this.props.x + "px , 0px)"};
        } else {
            style = {transform: "translateX(4096px)", 
                    transitionTimingFunction: "linear",  
                    transitionProperty: "transform", 
                    transitionDuration: (4096 - this.props.x)/(this.props.bpm * 16) * 60 + "s"
                }
        }
        return <div id="playhead" style={style}></div>
    }
}

export default PlayHead;