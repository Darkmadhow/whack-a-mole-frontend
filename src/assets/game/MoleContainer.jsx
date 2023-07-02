import { useEffect } from "react";
import MoleStandard from "./MoleStandard";
import MoleGolden from "./MoleGolden";
import MoleHardHat from "./MoleHardHat";
import MolePeeker from "./MolePeeker";
import MoleBunny from "./MoleBunny";
import MoleShroom from "./MoleShroom";

export default function MoleContainer({
  emitter,
  id,
  xInit,
  yInit,
  moles,
  setMoles,
  setMoleCount,
  haste,
  activeUpgrades,
  swingTimerDuration,
  cooldownActive,
  setCooldownActive,
  plugged,
  unplugger,
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
      case 7:
        newMole = "shroom";
        break;
      default:
        newMole = "standard";
        break;
    }

    moles[e.id].moleType = newMole;
    moles[e.id].key++;
    setMoles(moles);

    setMoleCount((prev) => {
      return { ...prev, [e.id]: prev[e.id] + 1 };
    });
  }

  //if my mole dies, replace it with a new one
  useEffect(() => {
    emitter.on("dead", replaceMole);
    // emitter.on('reset', replaceAllMoles);
    return () => {
      emitter.off("dead", replaceMole);
      // emitter.off('reset', replaceAllMoles);
    };
  }, []);

  //depending on the moleType, create a different mole
  switch (moles[id].moleType) {
    case "peeker":
      return (
        <MolePeeker
          xInit={xInit}
          yInit={yInit - 10}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
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
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
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
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
        />
      );
    case "bunny":
      return (
        <MoleBunny
          xInit={xInit}
          yInit={yInit + 15}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
        />
      );
    case "shroom":
      return (
        <MoleShroom
          xInit={xInit}
          yInit={yInit + 15}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
        />
      );
    default:
      return (
        <MoleStandard
          xInit={xInit}
          yInit={yInit}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
          activeUpgrades={activeUpgrades}
          swingTimerDuration={swingTimerDuration}
          cooldownActive={cooldownActive}
          setCooldownActive={setCooldownActive}
          plugged={plugged}
          unplugger={unplugger}
        />
      );
  }
}
