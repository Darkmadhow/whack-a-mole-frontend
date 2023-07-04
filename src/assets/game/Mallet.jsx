import React, { useEffect, useRef, useState, useCallback } from "react";
import { Sprite } from "@pixi/react";
import malletStandard from "../img/mallet.png";
import malletSpiked from "../img/mallet_spikey.png";
import malletRocket from "../img/mallet_rocket.png";
import { Rectangle } from "pixi.js";

const FRAME_DURATION = 50; // Frame duration in milliseconds

export default function Mallet({
  chosenUpgrades,
  emitter,
  ANIMATION_DURATION,
}) {
  const [[x, y], setCoords] = useState([0, 0]);
  const [rotation, setRotation] = useState(0.3);
  const [upgradedMallet, setUpgradedMallet] = useState("standard");
  const intervalRef = useRef(null);
  const rocket_mult = useRef(1);

  //function to make the mallet stick to the mouse pointer
  function moveMallet(e) {
    const pos = e.data.global;
    setCoords([pos.x, pos.y]);
  }

  const startAnimation = useCallback(
    (e) => {
      if (intervalRef.current) {
        return; // Animation is already running, ignore the new trigger
      }

      const initialRotation = rotation;
      const targetRotation = initialRotation - 0.5;
      const slamDuration = ANIMATION_DURATION * 0.2 * rocket_mult.current; // 20% duration for slam down
      const returnDuration = ANIMATION_DURATION * 0.8 * rocket_mult.current; // 80% duration for return

      let remainingDuration = ANIMATION_DURATION * rocket_mult.current;

      intervalRef.current = setInterval(() => {
        remainingDuration -= FRAME_DURATION;

        if (remainingDuration <= 0) {
          setRotation(initialRotation);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else {
          const progress =
            1 - remainingDuration / (ANIMATION_DURATION * rocket_mult.current);
          let currentRotation;

          if (progress <= slamDuration / ANIMATION_DURATION) {
            // Slam down phase
            const slamProgress = progress / (slamDuration / ANIMATION_DURATION);
            currentRotation = initialRotation - slamProgress * 0.5; // Adjust the value as needed
          } else {
            // Return phase
            const returnProgress =
              (progress - slamDuration / ANIMATION_DURATION) /
              (returnDuration / ANIMATION_DURATION);
            currentRotation = targetRotation + returnProgress * 0.025; // Adjust the value as needed
          }

          setRotation(currentRotation);
        }
      }, FRAME_DURATION);
    },
    [rotation, intervalRef, rocket_mult]
  );

  useEffect(() => {
    emitter.on("swing", startAnimation);

    return () => {
      emitter.off("swing", startAnimation);
    };
  }, [startAnimation, emitter]);

  //if the player chooses an upgrade, update the graphics if it was a mallet upgrade
  useEffect(() => {
    //search the array for mallet upgrades
    if (chosenUpgrades.some((upgrade) => upgrade.name === "spike_hammer")) {
      setUpgradedMallet("spike_hammer");
    } else if (
      chosenUpgrades.some((upgrade) => upgrade.name === "rocket_hammer")
    ) {
      setUpgradedMallet("rocket_hammer");
    }
  }, [chosenUpgrades]);

  if (upgradedMallet === "standard")
    return (
      <Sprite
        image={malletStandard}
        anchor={0.5}
        pivot={[165, 165]}
        scale={{ x: 0.4, y: 0.4 }}
        rotation={rotation}
        x={x + 70 + 45}
        y={y - 30}
        zIndex={4}
        interactive={true}
        onglobalpointermove={moveMallet}
        hitArea={Rectangle.EMPTY}
      ></Sprite>
    );

  if (upgradedMallet === "spike_hammer")
    return (
      <Sprite
        image={malletSpiked}
        anchor={0.5}
        pivot={[165, 165]}
        scale={{ x: 0.4, y: 0.4 }}
        rotation={rotation}
        x={x + 90 + 40}
        y={y - 70}
        zIndex={4}
        interactive={true}
        onglobalpointermove={moveMallet}
        hitArea={Rectangle.EMPTY}
      ></Sprite>
    );

  if (upgradedMallet === "rocket_hammer") {
    rocket_mult.current = 0.5;
    return (
      <Sprite
        image={malletRocket}
        anchor={0.5}
        pivot={[165, 165]}
        scale={{ x: 0.4, y: 0.4 }}
        rotation={rotation}
        x={x + 90 + 40}
        y={y - 50}
        zIndex={4}
        interactive={true}
        onglobalpointermove={moveMallet}
        hitArea={Rectangle.EMPTY}
      ></Sprite>
    );
  }
}
