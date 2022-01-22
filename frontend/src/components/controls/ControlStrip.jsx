import { Component } from "react";

class ControlStrip extends Component {
    constructor(props) {
        super(props);

        this.changeBPM = this.changeBPM.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);

        this.state = {
            selectedInput: "choose an input"
        }
    }

    changeBPM(event) {
        this.props.changeBPM(parseInt(event.target.value));
    }

    inputChangeHandler(event) {
        this.props.recorder.createContext();
        this.props.recorder.createInput(event.target.value);
        this.setState({selectedInput: event.target.value})
    }

    render() {
        return <div className="flex m-1 content-center">
            <div>
                <label>input: </label>
                <select value={this.state.selectedInput} onChange={this.inputChangeHandler}>
                    {this.props.inputs ? this.props.inputs.map(input => <option value={input.deviceId} key={input.deviceId}>{input.label}</option>): ""}
                </select>
            </div>
            <div>
                <label>bpm </label>
                <input type="number" min="0" max="200" defaultValue="120" onChange={this.changeBPM}/>
            </div>
            <div className="m-1 w-6 h-6 bg-slate-500" />
            <div className="m-1 w-6 h-6 bg-slate-500" />
            <div className="m-1 w-6 h-6 bg-slate-500" onClick={this.props.playHandler}/>
            <div className="m-1 w-6 h-6 bg-red-500" onClick={this.props.recordHandler}/>
        </div>
    }
}

export default ControlStrip;