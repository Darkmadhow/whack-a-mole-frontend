import React, { useEffect, useRef, useState } from "react";
import { Sprite, useTick } from "@pixi/react";
import moleGolden from "../img/mole_golden.png";
import moleStandardHit from "../img/mole_hit.png";

export default function MoleGolden({ xInit, yInit, emitter, id }) {
  const [x, setX] = useState(xInit);
  const [y, setY] = useState(yInit);
  const [moleImage, setMoleImage] = useState(moleGolden);
  const time = useRef(0);
  const my_id = useRef(id);
  const my_value = useRef(1000); //Standard Mole point value
  const my_decay = 800; //Decay rate of point value
  const jumpHeight = -125;
  const [stay_alive, stay_down] = [1000, 1000]; //Standard moles stay up for 3s and down for 1s

  const aliveTimer = useRef(null);
  const downTimer = useRef(null);
  const stateTimer = useRef(null);

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
      time.current += 0.05 * delta;
      setX(xInit);
    }
  });

  /* 
    getRandomTimeout
    returns: a random integer between min and max to use in a spawn timeout
  */
  const getRandomTimeout = () => {
    const min = 1000;
    const max = 7000;
    return Math.floor(Math.random() * max - min + 1) + min;
  };

  /*
    Upon Entering Stage, set a random timer upon which the mole wakes up
  */
  useEffect(() => {
    setTimeout(() => {
      setStateTimer(moleStates.alive);
      setMoleState(moleStates.spawning);
    }, getRandomTimeout());
    return () => {
      clearTimeout(aliveTimer.current);
      clearTimeout(downTimer.current);
      clearTimeout(stateTimer.current);
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
    stateTimer.current = setTimeout(() => setMoleState(state), 500);
  }

  /*
    onHammered logs a message when another mole gets hit
    param: e, the event that triggeres the mole hit
    DEPRECATED, WILL BE REMOVED
   */
  function onHammered(e) {
    if (e.current !== my_id.current)
      console.log("Mole ", e.current, " got hit, i am Mole ", my_id.current);
  }
  /*
   * useEffect that subscribes to the 'whacked' event
   * DEPRECATED, WILL BE REMOVED
   */
  useEffect(() => {
    emitter.on("whacked", onHammered);

    return () => {
      emitter.off("whacked", onHammered);
    };
  }, []);

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
        setTimeout(() => {
          console.log(my_id.current, " died");
          emitter.emit("dead", { id: my_id.current, value: my_value.current });
        }, 505);
      }}
    ></Sprite>
  );
}