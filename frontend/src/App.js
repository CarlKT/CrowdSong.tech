import './App.css';
import ControlStrip from './components/controls/ControlStrip';
import Tracks from "./components/grid/Tracks";
import Grid from "./components/grid/Grid";

function App() {
  return (
    <div className="App">
      <ControlStrip />
        <Grid />
    </div>
  );
}

export default App;
