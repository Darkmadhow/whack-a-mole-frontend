import React, { useContext, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { UserContext } from "../userContext";
import useAudio from "../utils/audio";

export default function Home() {
  const { isAuthenticated } = useContext(UserContext);
  const audioRef = useRef(null);

  const handlePageClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
      document.removeEventListener("click", handlePageClick);
    }
  };

  const handleIntroMusicEnd = () => {
    if (audioRef.current) {
      audioRef.current.removeEventListener("ended", handleIntroMusicEnd);
      audioRef.current.src = "menu-loop.ogg";
      audioRef.current.loop = true;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handlePageClick);
    if (audioRef.current)
      audioRef.current.addEventListener("ended", handleIntroMusicEnd);

    //pause the audio when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", handleIntroMusicEnd);
      }
    };
  }, []);

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
      <audio ref={audioRef} src="menu-intro.ogg" />
    </div>
  );
}
