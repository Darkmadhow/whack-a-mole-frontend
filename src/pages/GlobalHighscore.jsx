import React, { useState } from "react";
import NavBar from "../components/NavBar";
import ScoreTable from "../components/ScoreTable";

export default function GlobalHighscore() {
  const [gamemode, setGamemode] = useState("standard");

  function handleChange(e) {
    setGamemode(e.target.value);
  }

  return (
    <>
      <NavBar />
      <div className="highscore-global-page">
        <div className="score-container">
          <h3>Whack-a-Mole</h3>
          <h2>HIGHSCORE</h2>
          <select id="gamemode" name="gamemode" onChange={handleChange}>
            <option value="standard">Standard</option>
            <option value="time">Time Challenge</option>
            <option value="craze">60-Second-Craze</option>
          </select>
          <ScoreTable personal={false} gamemode={gamemode} />
        </div>
      </div>
    </>
  );
}
