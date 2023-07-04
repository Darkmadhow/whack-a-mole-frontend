import React from "react";
import "../styles/singleScore.css";

export default function SingleScore({ data }) {
  return (
    <div className="score">
      {data ? (
        <>
          <div className="user">{data.user.username}</div>
          <div className="user-score">{data.score}</div>
        </>
      ) : (
        "No data"
      )}
    </div>
  );
}
