import React, { useState, useRef } from "react";
import { Stage, Sprite, useTick } from "@pixi/react";
import { Texture } from "pixi.js";
import { EventEmitter } from "@pixi/utils";
import MoleStandard from "../assets/game/MoleStandard";
import "../styles/game.css";

export default function StandardGame() {
  const gameObserver = useRef(new EventEmitter());

  const stageProps = {
    height: 900,
    width: 1400,
    options: {
      backgroundAlpha: 0,
    },
  };

  return (
    <div className="game">
      <Stage {...stageProps}>
        <Sprite texture={Texture.WHITE} width={1} height={1} />
        <MoleStandard
          xInit={stageProps.width / 2}
          yInit={stageProps.height / 2}
          emitter={gameObserver.current}
          id={1}
        />
        <MoleStandard
          xInit={stageProps.width / 4}
          yInit={stageProps.height / 3}
          emitter={gameObserver.current}
          id={2}
        />
      </Stage>
    </div>
  );
}
