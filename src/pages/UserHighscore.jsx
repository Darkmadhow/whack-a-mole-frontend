import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import ScoreTable from "../components/ScoreTable";
import { UserContext } from "../userContext";
import "../styles/userHighscore.css";

export default function UserHighscore() {
  const { user } = useContext(UserContext);
  const [gamemode, setGamemode] = useState("standard");

  function handleChange(e) {
    setGamemode(e.target.value);
  }

  return (
    <>
      <div className="highscore-user-page">
        <NavBar />
        <div className="score-container">
          <div className="score-text">
            <h3>Whack-a-Mole</h3>
            <h2>HIGHSCORE</h2>
          </div>
          <div className="score-display">
            <select id="gamemode" name="gamemode" onChange={handleChange}>
              <option value="standard">Standard</option>
              <option value="time">Time Challenge</option>
              <option value="craze">60-Second-Craze</option>
            </select>
            <ScoreTable personal={true} gamemode={gamemode} />
          </div>
        </div>
      </div>
    </>
  );
}
