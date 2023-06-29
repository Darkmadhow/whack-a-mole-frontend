import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../userContext";
import getHighscores from "../utils/scores";
import SingleScore from "./SingleScore";
import { Navigate } from "react-router-dom";
import "../styles/scoreTable.css";

export default function ScoreTable({ personal, gamemode }) {
  const { user, token, isAuthenticated } = useContext(UserContext);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    (async () => {
      if (!personal || (personal && user))
        setScores(await getHighscores(token, personal ? user : null, gamemode));
    })();
  }, [gamemode]);

  if (!isAuthenticated) {
    alert("Please login to see Highscores");
    return <Navigate to="/" />;
  }
  return (
    <div className="score-table">
      {scores.length
        ? scores
            .filter((score) => score.gamemode === gamemode)
            .slice(0, 10)
            .map((score) => <SingleScore data={score} key={score._id} />)
        : "No Highscores yet"}
    </div>
  );
}
