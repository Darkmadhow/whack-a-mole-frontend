import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { UserContext } from "../userContext";
import { AudioPlayerContext } from "../utils/audioPlayerContext";

export default function Home() {
  const { isAuthenticated, isMuted } = useContext(UserContext);
  const audioPlayer = useContext(AudioPlayerContext);
  const { firstVisit, setFirstVisit } = useContext(AudioPlayerContext);

  // const handlePageClick = () => {
  //   if (audioPlayer) {
  //     if (firstVisit) {
  //       audioPlayer.setIntroAndLoop();
  //       setFirstVisit(false);
  //     }
  //     audioPlayer.play();
  //     // document.removeEventListener("click", handlePageClick);
  //   }
  // };

  useEffect(() => {
    if (!isMuted) {
      if (firstVisit) {
        audioPlayer.setIntroAndLoop();
        setFirstVisit(false);
      }
      audioPlayer.play();
    } else audioPlayer.pause();
  }, [isMuted]);

  useEffect(() => {
    // document.addEventListener("click", handlePageClick);
    if (audioPlayer && !isMuted) audioPlayer.play();

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
