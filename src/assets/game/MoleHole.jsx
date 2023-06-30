import { Sprite } from "@pixi/react";
import moleHoleColored from "../img/mole_hole_colored.png";
import moleHoleForeGround from "../img/mole_hole_foreground.png";
import { useState } from "react";

export default function MoleHole({ xInit, yInit, id, handler }) {
  const [x, setX] = useState(xInit);
  const [y, setY] = useState(yInit);

  return (
    <>
      <Sprite
        image={moleHoleColored}
        anchor={0.5}
        scale={{ x: 1, y: 1 }}
        x={x - 15}
        y={y}
        zIndex={-2}
        interactive={true}
        onrightclick={() => {
          handler(x, y, id);
        }}
      ></Sprite>
      <Sprite
        image={moleHoleForeGround}
        anchor={0.5}
        scale={{ x: 1, y: 1 }}
        x={x - 15}
        y={y}
        zIndex={2}
      ></Sprite>
    </>
  );
}
