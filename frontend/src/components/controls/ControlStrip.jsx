import { Component } from "react";

class ControlStrip extends Component {
    render() {
        return <div className="flex m-1 content-center">
            <div>
                <label>input </label>
                <input type="text"/>
            </div>
            <div>
                <label>bpm </label>
                <input type="number" min="0" max="200"/>
            </div>
            <div className="m-1 w-6 h-6 bg-slate-500" />
            <div className="m-1 w-6 h-6 bg-slate-500" />
            <div className="m-1 w-6 h-6 bg-slate-500" />
            <div className="m-1 w-6 h-6 bg-red-500" />
        </div>
    }
}

export default ControlStrip;