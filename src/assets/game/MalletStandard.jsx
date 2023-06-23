import React, { useState } from "react";
import { Sprite } from "@pixi/react";
import mallet from "../img/mallet.png";

export default function MalletStandard({ emitter }) {
  const [[x, y], setCoords] = useState([0, 0]);

  function moveMallet(e) {
    const pos = e.data.global;
    setCoords([pos.x, pos.y]);
  }

  //   function callClick(e) {
  //     emitter.emit("onpointerdown", { ...e, target: null });
  //     console.log(e);
  //   }

  return (
    <Sprite
      image={mallet}
      anchor={0.5}
      scale={{ x: 0.4, y: 0.4 }}
      rotation={0.3}
      x={x + 50}
      y={y - 50}
      zIndex={4}
      interactive={true}
      onglobalpointermove={moveMallet}
      //   onpointerdown={callClick}
    ></Sprite>
  );
}
