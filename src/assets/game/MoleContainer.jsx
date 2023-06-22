import { useEffect } from "react";
import MoleStandard from "./MoleStandard";

export default function MoleContainer({
  emitter,
  id,
  moleType,
  xInit,
  yInit,
  moles,
  setMoleCount,
}) {
  /*
   * replaceMole: replaces the string of the recently died mole with a new one
   * params: e, the event that was triggered by the dying mole
   */
  function replaceMole(e) {
    if (e.id !== id) return; //if some other mole dies, ignore the event
    const newMole = "standard"; //TODO: create random mole types
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
      return;
    case "hardhat":
      return; //TODO: Other mole types;
    default:
      return (
        <MoleStandard xInit={xInit} yInit={yInit} emitter={emitter} id={id} />
      );
  }
}
