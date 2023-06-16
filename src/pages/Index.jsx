import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import "../styles/index.css";
import { UserContext } from "../userContext";

export default function Index() {
  const { isAuthenticated } = useContext(UserContext);
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
