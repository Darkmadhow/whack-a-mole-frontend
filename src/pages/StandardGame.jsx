import React, { useState, useRef, useEffect } from "react";
import { Stage, Sprite, useTick, Container } from "@pixi/react";
import { Texture } from "pixi.js";
import { EventEmitter } from "@pixi/utils";
import MoleStandard from "../assets/game/MoleStandard";
import "../styles/game.css";
import MoleHole from "../assets/game/MoleHole";
import MoleContainer from "../assets/game/MoleContainer";

export default function StandardGame() {
  const gameObserver = useRef(new EventEmitter());
  const [mole_count, setMoleCount] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const [moles, setMoles] = useState([
    "standard",
    "standard",
    "standard",
    "standard",
    "standard",
  ]);

  const stageProps = {
    height: 900,
    width: 1400,
    options: {
      backgroundAlpha: 0,
    },
  };
  const hole_coords = [
    { x: 300, y: 200 },
    { x: 600, y: 200 },
    { x: 900, y: 200 },
    { x: 400, y: 400 },
    { x: 700, y: 400 },
  ];
  // gameObserver.current.on("dead", (e) => {
  //   const newMole = "standard";
  //   moles.splice(e.id, 1, newMole);
  //   console.log(e);
  //   console.log("Replacing mole Nr. ", mole_count);
  //   setMoleCount((prev) => {
  //     console.log(prev);
  //     return prev + 1;
  //   });
  // });

  return (
    <div className="game">
      <Stage {...stageProps}>
        <Sprite texture={Texture.WHITE} width={1} height={1} />
        {/* Hole Nr. 0 */}
        <Container sortableChildren={true}>
          <MoleContainer
            stageProps={stageProps}
            emitter={gameObserver.current}
            id={0}
            moleType={moles[0]}
            xInit={hole_coords[0].x}
            yInit={hole_coords[0].y}
            moles={moles}
            setMoleCount={setMoleCount}
            key={mole_count[0]}
          />
          <MoleHole xInit={hole_coords[0].x} yInit={hole_coords[0].y} />
        </Container>
        {/* Hole Nr. 1 */}
        <Container sortableChildren={true}>
          <MoleContainer
            stageProps={stageProps}
            emitter={gameObserver.current}
            id={1}
            moleType={moles[1]}
            xInit={hole_coords[1].x}
            yInit={hole_coords[1].y}
            moles={moles}
            setMoleCount={setMoleCount}
            key={mole_count[1]}
          />
          <MoleHole xInit={hole_coords[1].x} yInit={hole_coords[1].y} />
        </Container>
        {/* Hole Nr. 2 */}
        <Container sortableChildren={true}>
          <MoleContainer
            stageProps={stageProps}
            emitter={gameObserver.current}
            id={2}
            moleType={moles[2]}
            xInit={hole_coords[2].x}
            yInit={hole_coords[2].y}
            moles={moles}
            setMoleCount={setMoleCount}
            key={mole_count[2]}
          />
          <MoleHole xInit={hole_coords[2].x} yInit={hole_coords[2].y} />
        </Container>
        {/* Hole Nr. 3 */}
        <Container sortableChildren={true}>
          <MoleContainer
            stageProps={stageProps}
            emitter={gameObserver.current}
            id={3}
            moleType={moles[3]}
            xInit={hole_coords[3].x}
            yInit={hole_coords[3].y}
            moles={moles}
            setMoleCount={setMoleCount}
            key={mole_count[3]}
          />
          <MoleHole xInit={hole_coords[3].x} yInit={hole_coords[3].y} />
        </Container>
        {/* Hole Nr. 4 */}
        <Container sortableChildren={true}>
          <MoleContainer
            stageProps={stageProps}
            emitter={gameObserver.current}
            id={4}
            moleType={moles[4]}
            xInit={hole_coords[4].x}
            yInit={hole_coords[4].y}
            moles={moles}
            setMoleCount={setMoleCount}
            key={mole_count[4]}
          />
          <MoleHole xInit={hole_coords[4].x} yInit={hole_coords[4].y} />
        </Container>
      </Stage>
    </div>
  );
}
