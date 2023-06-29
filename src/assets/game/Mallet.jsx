import React, { useEffect, useState } from "react";
import { Sprite } from "@pixi/react";
import malletStandard from "../img/mallet.png";
import malletSpiked from "../img/mallet_spikey.png";
import malletRocket from "../img/mallet_rocket.png";
import { Rectangle } from "pixi.js";

export default function Mallet({ chosenUpgrades }) {
  const [[x, y], setCoords] = useState([0, 0]);
  const [upgradedMallet, setUpgradedMallet] = useState("standard");

  //function to make the mallet stick to the mouse pointer
  function moveMallet(e) {
    const pos = e.data.global;
    setCoords([pos.x, pos.y]);
  }

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

  if (upgradedMallet === "spike_hammer")
    return (
      <Sprite
        image={malletSpiked}
        anchor={0.5}
        scale={{ x: 0.4, y: 0.4 }}
        rotation={0.3}
        x={x + 90}
        y={y - 90}
        zIndex={4}
        interactive={true}
        onglobalpointermove={moveMallet}
        hitArea={Rectangle.EMPTY}
      ></Sprite>
    );

  if (upgradedMallet === "rocket_hammer")
    return (
      <Sprite
        image={malletRocket}
        anchor={0.5}
        scale={{ x: 0.4, y: 0.4 }}
        rotation={0.3}
        x={x + 90}
        y={y - 90}
        zIndex={4}
        interactive={true}
        onglobalpointermove={moveMallet}
        hitArea={Rectangle.EMPTY}
      ></Sprite>
    );
}
