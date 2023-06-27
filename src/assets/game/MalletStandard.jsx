import React, { useState } from "react";
import { Sprite } from "@pixi/react";
import mallet from "../img/mallet.png";
import { Rectangle } from "pixi.js";

export default function MalletStandard() {
  const [[x, y], setCoords] = useState([0, 0]);

  function moveMallet(e) {
    const pos = e.data.global;
    setCoords([pos.x, pos.y]);
  }

  return (
    <Sprite
      image={mallet}
      anchor={0.5}
      scale={{ x: 0.4, y: 0.4 }}
      rotation={0.3}
      x={x + 70}
      y={y - 70}
      zIndex={4}
      interactive={true}
      onglobalpointermove={moveMallet}
      hitArea={Rectangle.EMPTY}
    ></Sprite>
  );
}
