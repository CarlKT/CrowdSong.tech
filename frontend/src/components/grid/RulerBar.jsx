import { Component } from "react";
import "./RulerBar.css"

class RulerBar extends Component {
    render () {
        return <div className="ruler-bar" onClick={() => this.props.move(this.props.i)}>
            {this.props.i}
        </div>
    }
}

export default RulerBar;