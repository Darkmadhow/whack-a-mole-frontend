import { useEffect } from "react";
import MoleStandard from "./MoleStandard";
import MoleGolden from "./MoleGolden";
import MoleHardHat from "./MoleHardHat";
import MolePeeker from "./MolePeeker";
import MoleBunny from "./MoleBunny";

export default function MoleContainer({
  emitter,
  id,
  moleType,
  xInit,
  yInit,
  moles,
  setMoleCount,
  haste
}) {
  /*
   * replaceMole: replaces the string of the recently died mole with a new one
   * params: e, the event that was triggered by the dying mole
   */
  function replaceMole(e) {
    if (e.id !== id) return; //if some other mole dies, ignore the event
    const rnd = Math.floor(Math.random() * 13);
    let newMole = "standard";
    switch (rnd) {
      case 0:
      case 1:
        newMole = "peeker";
        break;
      case 2:
      case 3:
        newMole = "hardhat";
        break;
      case 4:
        newMole = "golden";
        break;
      case 5:
      case 6:
        newMole = "bunny";
        break;
      default:
        newMole = "standard";
        break;
    }
    // console.log("new mole will be a ", newMole, rnd);
    moles.splice(e.id, 1, newMole);
    setMoleCount((prev) => {
      return { ...prev, [e.id]: prev[e.id] + 1 };
    });
  }

  //if my mole dies, replace it with a new one
  useEffect(() => {
    emitter.on("dead", replaceMole);
    return () => emitter.off("dead", replaceMole);
  }, []);

  //depending on the moleType, create a different mole
  switch (moleType) {
    case "peeker":
      return (
        <MolePeeker
          xInit={xInit}
          yInit={yInit - 10}
          emitter={emitter}
          id={id}
          haste={haste}
        />
      );
    case "hardhat":
      return (
        <MoleHardHat
          xInit={xInit}
          yInit={yInit + 12}
          emitter={emitter}
          id={id}
          haste={haste}
        />
      );
    case "golden":
      return (
        <MoleGolden
          xInit={xInit}
          yInit={yInit + 10}
          emitter={emitter}
          id={id}
          haste={haste}
        />
      );
    case "bunny":
      return (
        <MoleBunny 
        xInit={xInit} 
        yInit={yInit + 15} 
        emitter={emitter} 
        id={id} 
        haste={haste}/>
      );
    default:
      return (
        <MoleStandard 
        xInit={xInit} 
        yInit={yInit} 
        emitter={emitter} 
        id={id} 
        haste={haste}/>
      );
  }
}
