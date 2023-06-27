import React, { useEffect, useRef, useState } from "react";
import { Sprite, useTick } from "@pixi/react";
import molePeeker from "../img/mole_peeker.png";
import moleStandardHit from "../img/mole_hit.png";

export default function MolePeeker({ xInit, yInit, emitter, id, haste }) {
  const [x, setX] = useState(xInit);
  const [y, setY] = useState(yInit);
  const [moleImage, setMoleImage] = useState(molePeeker);
  const time = useRef(0);
  const my_id = useRef(id);
  const my_value = useRef(300); //Standard Mole point value
  const my_decay = 100; //Decay rate of point value
  const jumpHeight = -75;
  const [stay_alive, stay_down] = [2000/haste, 2000/haste]; //Peeker moles stay up for 2s base and down for 2s

  const aliveTimer = useRef(null);
  const downTimer = useRef(null);
  const stateTimer = useRef(null);
  const spawnTimer = useRef(null);
  const deadTimer = useRef(null);

  const moleStates = {
    dead: "dead",
    alive: "alive",
    spawning: "spawning",
    dying: "dying",
    down: "down",
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
    const min = 1000/haste;
    const max = 7000/haste;
    return Math.floor(Math.random() * max - min + 1) + min;
  };

  /*
    Upon Entering Stage, set a random timer upon which the mole wakes up and subscribe to game events
  */
  useEffect(() => {
    emitter.on("reset_incoming", stopAllTimeouts);

    spawnTimer.current = setTimeout(() => {
      setStateTimer(moleStates.alive);
      setMoleState(moleStates.spawning);
    }, getRandomTimeout());
    return () => {
      emitter.off("reset_incoming", stopAllTimeouts);

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
      aliveTimer.current = setTimeout(() => {
        //when alive timer's up, go to hiding state and reduce point value
        setStateTimer(moleStates.down);
        setMoleState(moleStates.dying);
        my_value.current -= my_decay;
      }, stay_alive);
    }
    //resurface after a while, reset animation timeline
    if (moleState === moleStates.down) {
      emitter.emit("evaded");
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
    stateTimer.current = setTimeout(() => setMoleState(state), 500/haste);
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
      console.log("mole", id, " killed itself")
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
          ? "none"
          : "static"
      }
      pointerdown={() => {
        //upon being clicked, start timer to die and change state, emit hit event with mole id
        console.log("WHACK!");
        setMoleState(moleStates.dying);
        setStateTimer(moleStates.dead);
        setMoleImage(moleStandardHit);
        clearTimeout(aliveTimer.current);
        clearTimeout(downTimer.current);
        deadTimer.current = setTimeout(() => {
          // console.log(my_id.current, " died");
          emitter.emit("dead", { id: my_id.current, value: my_value.current });
        }, 505/haste);
      }}
    ></Sprite>
  );
}
