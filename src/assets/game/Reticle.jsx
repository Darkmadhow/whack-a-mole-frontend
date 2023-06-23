import { Sprite } from "@pixi/react";
import React from "react";
import reticle from "../img/reticle.png";

export default function Reticle(x, y) {
  return (
    <Sprite
      image={reticle}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
      x={x}
      y={y}
      zIndex={4}
    ></Sprite>
  );
}
