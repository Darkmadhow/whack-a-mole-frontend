import { Sprite } from "@pixi/react";
import React, { useState } from "react";
import reticle from "../img/reticle.png";
import { Rectangle } from "pixi.js";

export default function Reticle() {
  const [[x,y], setCoords] = useState([0,0])

  function moveReticle(e) {
    const pos = e.data.global;
    setCoords([pos.x, pos.y]);
  }

  return (
    <Sprite
      image={reticle}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
      x={x}
      y={y}
      zIndex={4}
      interactive={true}
      onglobalpointermove={moveReticle}
      hitArea={Rectangle.EMPTY}
    ></Sprite>
  );
}
