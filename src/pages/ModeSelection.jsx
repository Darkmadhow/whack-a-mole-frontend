import React, { useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../styles/modeSelection.css";
import AudioPlayerContext from "../utils/audioPlayerContext";

export default function ModeSelection() {
  const audioPlayer = useContext(AudioPlayerContext);

  useEffect(() => {
    if (audioPlayer) audioPlayer.play();

    return () => {
      if (audioPlayer) audioPlayer.pause();
    };
  }, []);

  return (
    <div className="mode-selection-page">
      <NavBar />
      <div className="selection-menu">
        <h1>Select a Gamemode</h1>
        <Link to="/standardGame">
          <button>Standard</button>
        </Link>
        <Link to="/timeChallenge">
          <button>Time Challenge</button>
        </Link>
        <Link to="/sixtySecondsCraze">
          <button>60 Seconds Craze</button>
        </Link>
      </div>
    </div>
  );
}
