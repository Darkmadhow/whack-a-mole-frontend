import React from "react";

export default function SingleScore({ data }) {
  return (
    <div className="score">
      {data ? (
        <div>
          {data.user.username}
          {data.score}
        </div>
      ) : (
        "No data"
      )}
    </div>
  );
}
