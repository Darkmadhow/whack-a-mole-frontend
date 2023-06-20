import React, { useEffect, useRef, useState } from "react";
import { Sprite, useTick } from "@pixi/react";
import moleStandard from "../img/mole.png";

export default function MoleStandard({ xInit, yInit, emitter, id }) {
  const [x, setX] = useState(xInit);
  const [y, setY] = useState(yInit);
  const [whacked, setWhacked] = useState(false);
  const time = useRef(0);
  const my_id = useRef(id);

  useTick((delta) => {
    if (whacked) return null;
    time.current += 0.05 * delta;
    setY(Math.sin(time.current) * 100 + yInit);
    setX(xInit);
  });

  function onHammered(e) {
    if (e.current !== my_id.current)
      console.log("Mole ", e.current, " got hit, i am Mole ", my_id.current);
  }

  useEffect(() => {
    emitter.on("whacked", onHammered);

    return () => {
      emitter.off("whacked", onHammered);
    };
  }, []);

  return (
    <Sprite
      image={moleStandard}
      anchor={0.5}
      scale={{ x: 0.3, y: 0.3 }}
      x={x}
      y={y}
      eventMode="static"
      pointerdown={() => {
        console.log("WHACK!");
        setWhacked(!whacked);
        emitter.emit("whacked", my_id);
      }}
    ></Sprite>
  );
}
