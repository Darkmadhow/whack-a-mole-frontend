import React, { useEffect, useRef, useState } from 'react';
import { Sprite, useTick } from '@pixi/react';
import moleGolden from '../img/mole_golden.png';
import moleGoldenHit from '../img/mole_golden_hit.png';
import { sound } from '@pixi/sound';

export default function MoleGolden({
  xInit,
  yInit,
  emitter,
  id,
  haste,
  activeUpgrades,
  swingTimerDuration,
  cooldownActive,
  setCooldownActive,
  plugged,
  unplugger,
  isMuted,
}) {
  const [x, setX] = useState(xInit);
  const [y, setY] = useState(yInit);
  const [moleImage, setMoleImage] = useState(moleGolden);
  const time = useRef(0);
  const my_id = useRef(id);
  const my_value = useRef(1000); //Standard Mole point value
  const my_time_value = 7;
  const my_craze_value = useRef(180);
  const my_decay = 800; //Decay rate of point value
  const jumpHeight = -125;
  const [stay_alive, stay_down] = [1000 / haste, 1000 / haste]; //Golden moles stay up for 1s base and down for 1s
  const spikedHammer = activeUpgrades.some(
    (upgrade) => upgrade.name === 'spike_hammer'
  ); //golden mole needs to know wether spiked Hammer is active or not
  const TRAP_TIMER = 3000; //the amount of time a mole will be stuck in a trap

  const aliveTimer = useRef(null);
  const downTimer = useRef(null);
  const stateTimer = useRef(null);
  const spawnTimer = useRef(null);
  const deadTimer = useRef(null);

  const moleStates = {
    dead: 'dead',
    alive: 'alive',
    spawning: 'spawning',
    dying: 'dying',
    down: 'down',
  };

  const [moleState, setMoleState] = useState(moleStates.dead);

  /*
    useTick animates the mole depending on its state
    param: delta, seems to be 1
  */
  useTick((delta) => {
    if (moleState === moleStates.dead || moleState === moleStates.down) {
      //if mole is dead, do not advance timeline
      setY(yInit);
    } else if (moleState === moleStates.alive) {
      setY(yInit + jumpHeight);
      setX(xInit);
    } else if (
      //if mole should be moving during spawn or dying, advance timeline, update Y
      moleState === moleStates.spawning ||
      moleState === moleStates.dying
    ) {
      // console.log('y:', y, 'time.current:', time.current, 'delta:', delta);
      setY(Math.sin(time.current) * jumpHeight + yInit);
      time.current += 0.05 * delta * haste;
      setX(xInit);
    }
  });

  /* 
    getRandomTimeout
    returns: a random integer between min and max to use in a spawn timeout
  */
  const getRandomTimeout = () => {
    const min = 1000 / haste;
    const max = 7000 / haste;
    return Math.floor(Math.random() * max - min + 1) + min;
  };

  /*
    Upon Entering Stage, set a random timer upon which the mole wakes up and subscribe to game events
  */
  useEffect(() => {
    emitter.on('reset_incoming', stopAllTimeouts);
    emitter.on('boom', killMoleForcefully);

    spawnTimer.current = setTimeout(() => {
      setStateTimer(moleStates.alive);
      setMoleState(moleStates.spawning);
    }, getRandomTimeout());
    return () => {
      emitter.off('reset_incoming', stopAllTimeouts);
      emitter.off('boom', killMoleForcefully);

      clearTimeout(aliveTimer.current);
      clearTimeout(downTimer.current);
      clearTimeout(stateTimer.current);
      clearTimeout(deadTimer.current);
      clearTimeout(spawnTimer.current);
    };
  }, []);

  /*
   * Upon becoming alive, record the time and start despawn timer
   * Upon Down, resurface after a while, reset timeline
   */
  useEffect(() => {
    if (moleState === moleStates.alive) {
      //if there's a trap on the hole, stay up for longer
      if (plugged[id] && plugged[id].name === 'trap') {
        if (!isMuted) sound.play('trap');
        aliveTimer.current = setTimeout(() => {
          removePlug();
          //when alive timer's up, go to hiding state and reduce point value
          setStateTimer(moleStates.down);
          setMoleState(moleStates.dying);
          my_value.current -= my_decay;
        }, stay_alive + TRAP_TIMER);
      } else {
        aliveTimer.current = setTimeout(() => {
          setStateTimer(moleStates.down);
          setMoleState(moleStates.dying);
          my_value.current -= my_decay;
        }, stay_alive);
      }
    }
    //resurface after a while, reset animation timeline
    if (moleState === moleStates.down) {
      emitter.emit('evaded', {
        value: my_value.current,
        time_value: my_time_value,
        craze_value: my_craze_value.current,
      });
      time.current = 0;
      downTimer.current = setTimeout(() => {
        setStateTimer(moleStates.alive);
        setMoleState(moleStates.spawning);
      }, stay_down);
    }
  }, [moleState]);

  /*
  setStateTimer sets a timeout after which the mole changes state
  param: state, the state into which the mole will switch into after timer expires
  */
  function setStateTimer(state) {
    stateTimer.current = setTimeout(() => setMoleState(state), 500 / haste);
  }

  /*
    stopAllTimeouts deletes all running timers in preparation of a stage reset
    param: e, the event that triggeres the mole hit
   */
  function stopAllTimeouts(e) {
    clearTimeout(aliveTimer.current);
    clearTimeout(downTimer.current);
    clearTimeout(stateTimer.current);
    clearTimeout(deadTimer.current);
    clearTimeout(spawnTimer.current);
  }

  function killMoleForcefully() {
    killMole(true);
  }
  /*
   * killMole initiates the mole despawning
   * params: force, boolean for killing the mole even if swing timer is on cooldown
   */
  function killMole(force) {
    // Check if the cooldown is active
    if (cooldownActive && !force) return;

    //tell the hammer to animate if it wasnt a kill by other forces
    if (!force) emitter.emit('swing', { speed: haste });

    if (!isMuted) sound.play('golden');

    //upon being clicked, start timer to die and change state, emit hit event with mole id
    setMoleState(moleStates.dying);
    setStateTimer(moleStates.dead);
    setMoleImage(moleGoldenHit);
    clearTimeout(aliveTimer.current);
    clearTimeout(downTimer.current);
    deadTimer.current = setTimeout(() => {
      // console.log(my_id.current, " died");
      emitter.emit('dead', {
        id: my_id.current,
        value: spikedHammer ? my_value.current * 1.5 : my_value.current,
        time_value: my_time_value - 4, //only get 3 seconds for hitting golden mole, instead of 7
      });
    }, 505 / haste);

    //clear deployed upgrades
    removePlug();

    //if the player chose the rocket hammer, trigger only half the cooldown
    const rocket_mult = activeUpgrades.some(
      (upgrade) => upgrade.name === 'rocket_hammer'
    )
      ? 0.5
      : 1;
    // Activate the swing timer cooldown
    setCooldownActive(true);
    setTimeout(() => {
      setCooldownActive(false);
    }, swingTimerDuration * rocket_mult);
  }

  //removes the deployed upgrade from the hole
  function removePlug() {
    plugged[id]?.dependantChild?.destroy();
    plugged[id]?.destroy();
    unplugger((prev) => {
      return { ...prev, [id]: null };
    });
  }

  return (
    <Sprite
      image={moleImage}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
      x={x}
      y={y + 90}
      zIndex={1}
      eventMode={
        moleState === moleStates.dying || moleState === moleStates.dead
          ? 'none'
          : 'static'
      }
      pointerdown={() => killMole(false)}></Sprite>
  );
}
