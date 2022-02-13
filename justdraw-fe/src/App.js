import { Route, Routes } from "react-router-dom";
import Home from './views/castside/home';
import PaintGame from './views/castside/paintgame';
import JoinGame from './views/playerside/join';
import PlayerScreen from './views/playerside/playerscreen';
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useState } from "react";
import TestPaint from "./components/testpaint";

function App() {
  const [showFullScreenButton, setShowFullScreenButton] = useState(true);
  const toggleFullSceen = () => {
    if (!document.fullscreenElement) {
      setShowFullScreenButton(false);
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        setShowFullScreenButton(true);
        document.exitFullscreen();
      }
    }
  };
  return (
    <div className="App">   
      <button className="full-screen-button" onClick={() => toggleFullSceen()}>
        {showFullScreenButton ? <BsFullscreen /> : <BsFullscreenExit />}
      </button>
    
      <Routes>
        {/* cast side */}
        <Route path="/room/*" element={<PaintGame />} />
        <Route path="/" element={<Home />} />

        {/* player site */}
        <Route path="/join" element={<JoinGame />} />
        <Route path="/play" element={<PlayerScreen />} />
        <Route path="test" element={<TestPaint />}/>
      </Routes>
    </div>
  );
}

export default App;
