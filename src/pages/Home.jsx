import React, { useContext, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { UserContext } from "../userContext";
import { AudioPlayerContext } from "../utils/audioPlayerContext";

export default function Home() {
  const { isAuthenticated } = useContext(UserContext);
  const audioPlayer = useContext(AudioPlayerContext);

  const handlePageClick = () => {
    if (audioPlayer) {
      audioPlayer.setIntroAndLoop();
      audioPlayer.play();
      document.removeEventListener("click", handlePageClick);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handlePageClick);
    if (audioPlayer) audioPlayer.play();

    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);

  return (
    <div className="homepage">
      <NavBar />
      <div className="main-menu">
        <h1>Whack-a-Mole</h1>
        <Link to="/modeselection">
          <button>Play</button>
        </Link>
        <Link to="/tutorial">
          <button>How to play</button>
        </Link>
        <Link to="/globalhighscore">
          <button>Highscores</button>
        </Link>
        {isAuthenticated && (
          <Link to="/userhighscore">
            <button>Personal Highscores</button>
          </Link>
        )}
      </div>
    </div>
  );
}
