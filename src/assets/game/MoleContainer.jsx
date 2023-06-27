import { useEffect } from 'react';
import MoleStandard from './MoleStandard';
import MoleGolden from './MoleGolden';
import MoleHardHat from './MoleHardHat';
import MolePeeker from './MolePeeker';
import MoleBunny from './MoleBunny';

export default function MoleContainer({
  emitter,
  id,
  moleType,
  xInit,
  yInit,
  moles,
  setMoles,
  setMoleCount,
  haste,
}) {
  /*
   * replaceMole: replaces the string of the recently died mole with a new one
   * params: e, the event that was triggered by the dying mole
   */
  function replaceMole(e) {
    if (e.id !== id) return; //if some other mole dies, ignore the event
    const rnd = Math.floor(Math.random() * 13);
    let newMole = 'standard';
    switch (rnd) {
      case 0:
      case 1:
        newMole = 'peeker';
        break;
      case 2:
      case 3:
        newMole = 'hardhat';
        break;
      case 4:
        newMole = 'golden';
        break;
      case 5:
      case 6:
        newMole = 'bunny';
        break;
      default:
        newMole = 'standard';
        break;
    }
    console.log('new mole will be a ', newMole, rnd);
    // moles.splice(e.id, 1, newMole);
    const molesTemp = moles;
    molesTemp[e.id].moleType = newMole;
    molesTemp[e.id].key++;
    setMoles(molesTemp);

    setMoleCount((prev) => {
      return { ...prev, [e.id]: prev[e.id] + 1 };
    });
  }

  function replaceAllMoles() {
    const rnd = Math.floor(Math.random() * 13);
    let newMole = 'standard';
    switch (rnd) {
      case 0:
      case 1:
        newMole = 'peeker';
        break;
      case 2:
      case 3:
        newMole = 'hardhat';
        break;
      case 4:
        newMole = 'golden';
        break;
      case 5:
      case 6:
        newMole = 'bunny';
        break;
      default:
        newMole = 'standard';
        break;
    }
    // const newMoles = moles.splice(id, 1, newMole);
    // setMoles((prev) => prev.toSpliced(id, 1, newMole));
    const molesTemp = moles;
    molesTemp[id].moleType = newMole;
    molesTemp[id].key++;
    setMoles(molesTemp);

    console.log('RESET: replaced mole on reset: ', id, 'with', newMole);
    console.log('old moles: ', moles);
  }

  //if my mole dies, replace it with a new one
  useEffect(() => {
    emitter.on('dead', replaceMole);
    emitter.on('reset', replaceAllMoles);
    return () => {
      emitter.off('dead', replaceMole);
      emitter.off('reset', replaceAllMoles);
    };
  }, []);

  useEffect(() => {
    console.log('Moles changed in', id, 'Key:', moles[id].key, 'Moles:', moles);
  }, [moles]);

  // useEffect(() => {
  //   console.log('Moletype changed in', id, 'Moletype:', moleType);
  // }, [moleType]);

  //depending on the moleType, create a different mole
  switch (moles[id].moleType) {
    case 'peeker':
      return (
        <MolePeeker
          xInit={xInit}
          yInit={yInit - 10}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
        />
      );
    case 'hardhat':
      return (
        <MoleHardHat
          xInit={xInit}
          yInit={yInit + 12}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
        />
      );
    case 'golden':
      return (
        <MoleGolden
          xInit={xInit}
          yInit={yInit + 10}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
        />
      );
    case 'bunny':
      return (
        <MoleBunny
          xInit={xInit}
          yInit={yInit + 15}
          emitter={emitter}
          id={id}
          haste={haste}
          key={moles[id].key}
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
        />
      );
  }
}
