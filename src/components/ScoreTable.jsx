import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../userContext";
import getHighscores from "../utils/scores";
import SingleScore from "./SingleScore";
import { Navigate } from "react-router-dom";

export default function ScoreTable({ user, gamemode }) {
  const { token, isAuthenticated } = useContext(UserContext);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    (async () => setScores(await getHighscores(token, user)))();
  }, []);

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
        : "Loading Highscores"}
    </div>
  );
}
