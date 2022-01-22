import { Component } from "react";

class Clip extends Component {
    render() {
        return <div class="bg-cyan-300 absolute h-full" style={{transform: "translateX(" + this.props.start + "rem)", width: this.props.width + "rem" }}>            
        </div>
    }
}

export default Clip;