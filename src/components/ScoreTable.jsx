import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import axios from "axios";
import SingleScore from "./SingleScore";

export default function ScoreTable({ personal, gamemode }) {
  const { user } = useContext(UserContext);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let url = `${import.meta.env.VITE_BACKEND_API}/highscores`;
        if (personal) url += "/" + user?._id;
        const res = await axios.get(url, {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ4YzI2MTA2YzI3N2E2YmQ4MWI3MDk4IiwiaWF0IjoxNjg2OTA2Mzg1fQ.N2Q5M2fAj9ARi3W36HmdJwuL3LXH0HwkmBmjjP9GZiY",
          },
        });
        setScores(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
