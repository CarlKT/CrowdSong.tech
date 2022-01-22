import { Component } from "react";
import PlayHead from "./PlayHead";
import Track from "./Track";

class Grid extends Component {
    render() {
        return <div className="grid w-full h-full grid-rows-5" style={{gridTemplateColumns: "96px auto"}}>
            <div className="bg-black w-full">hi</div>
        </div>
    }
}

export default Grid;