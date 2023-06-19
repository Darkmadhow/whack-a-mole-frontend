import React from "react";
import "../styles/singleScore.css";

export default function SingleScore({ data }) {
  return (
    <div className="score">
      {data ? (
        <>
          <div>{data.user.username}</div>
          <div>{data.score}</div>
        </>
      ) : (
        "No data"
      )}
    </div>
  );
}
