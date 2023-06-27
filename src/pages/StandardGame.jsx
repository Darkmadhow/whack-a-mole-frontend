import React, { useState, useRef, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Stage, Sprite, Container } from '@pixi/react';
import { Texture, Graphics } from 'pixi.js';
import { EventEmitter } from '@pixi/utils';
import '../styles/game.css';
import MoleHole from '../assets/game/MoleHole';
import MoleContainer from '../assets/game/MoleContainer';
import MalletStandard from '../assets/game/MalletStandard';
import { uploadHighScore } from '../utils/scores';
import { UserContext } from '../userContext';
import Reticle from '../assets/game/Reticle';

export default function StandardGame() {
  const [stage, setStage] = useState();
  //the event emitter that will handle all game interactions
  const gameObserver = useRef(new EventEmitter());
  //initial score and lives
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  //difficulty speed multiplier
  const haste = useRef(1);

  //subscribe to mole events
  const { token } = useContext(UserContext);
  useEffect(() => {
    gameObserver.current.on('dead', updateScore);
    gameObserver.current.on('evaded', subtractLife);
    return () => {
      gameObserver.current.off('dying', updateScore);
      gameObserver.current.off('evaded', subtractLife);
    };
  }, []);

  function updateScore(e) {
    setScore((prev) => prev + e.value);
  }

  function subtractLife() {
    setLives((prev) => prev - 1);
  }
  //counter for the moles in each hole, as iterable object
  const [mole_count, setMoleCount] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  //current mole type in each hole, as a string array
  const [moles, setMoles] = useState([
    { moleType: 'standard', key: 1000 },
    { moleType: 'standard', key: 2000 },
    { moleType: 'standard', key: 3000 },
    { moleType: 'standard', key: 4000 },
    { moleType: 'standard', key: 5000 },
  ]);
  // console.log('moles in StandardGame: ', moles);

  //--------------- Stage Settings ---------------
  const stageProps = {
    height: 900,
    width: 1400,
    options: {
      backgroundAlpha: 0,
    },
  };
  const hole_coords = [
    { x: 300, y: 200 },
    { x: 600, y: 200 },
    { x: 900, y: 200 },
    { x: 400, y: 400 },
    { x: 700, y: 400 },
  ];
  const hole_masks = useRef({
    0: drawCircleMask(hole_coords[0].x, hole_coords[0].y),
    1: drawCircleMask(hole_coords[1].x, hole_coords[1].y),
    2: drawCircleMask(hole_coords[2].x, hole_coords[2].y),
    3: drawCircleMask(hole_coords[3].x, hole_coords[3].y),
    4: drawCircleMask(hole_coords[4].x, hole_coords[4].y),
  });
  //--------------- Stage Settings End ---------------

  /*
   * drawCircleMask: draws a circular Graphics object with red fill
   * params: x,y define the position and the center of the circle
   * returns: Graphics object, a circle
   */
  function drawCircleMask(x, y) {
    let newCircle = new Graphics();
    newCircle.position.set(x, y);
    newCircle.lineStyle(2, 0xff0000);
    newCircle.beginFill(0xff0000, 0.5);
    newCircle.drawCircle(x, y - 138, 200);
    newCircle.endFill();
    return newCircle;
  }

  /*
   * increases difficulty over time
   */
  useEffect(() => {
    //count moles hit
    const molecounter =
      mole_count[0] +
      mole_count[1] +
      mole_count[2] +
      mole_count[3] +
      mole_count[4] +
      1;
    //increase difficulty every 10 moles
    if (!(molecounter % 3)) {
      haste.current *= 1.03;
      console.log('Difficulty increased');
      gameObserver.current.emit('reset_incoming');
      stage.stop();
      setTimeout(() => {
        gameObserver.current.emit('reset');
        stage.start();
      }, 5000);
    }
  }, [mole_count]);

  //game over at 0 lives
  if (lives <= -1110) {
    uploadHighScore(token, { score: score, gamemode: 'standard' });

    return (
      <div className="game">
        <div className="game-over-screen">
          <h2>You got {score} points</h2>
          {/* TODO: Load Highscore placement */}

          <NavLink to="/">
            <button>Back to Menu</button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-stats">
        <NavLink to="/modeselection">Back</NavLink>
        <div className="score-display">Score: {score}</div>
        <div className="lives">Lives: {lives}</div>
      </div>
      <Stage {...stageProps} onMount={setStage}>
        <Container sortableChildren={true}>
          <Sprite texture={Texture.WHITE} width={1} height={1} />
          <MalletStandard />
          <Reticle />
          {/* Hole Nr. 0 */}
          <Container sortableChildren={true} mask={hole_masks.current[0]}>
            <MoleContainer
              stageProps={stageProps}
              emitter={gameObserver.current}
              id={0}
              // moleType={moles[0].moleType}
              xInit={hole_coords[0].x}
              yInit={hole_coords[0].y}
              moles={moles}
              setMoles={setMoles}
              setMoleCount={setMoleCount}
              // key={moles[0].key}
              haste={haste.current}
            />
            <MoleHole xInit={hole_coords[0].x} yInit={hole_coords[0].y} />
          </Container>
          {/* Hole Nr. 1 */}
          <Container sortableChildren={true} mask={hole_masks.current[1]}>
            <MoleContainer
              stageProps={stageProps}
              emitter={gameObserver.current}
              id={1}
              // moleType={moles[1].moleType}
              xInit={hole_coords[1].x}
              yInit={hole_coords[1].y}
              moles={moles}
              setMoles={setMoles}
              setMoleCount={setMoleCount}
              // key={moles[1].key}
              haste={haste.current}
            />
            <MoleHole xInit={hole_coords[1].x} yInit={hole_coords[1].y} />
          </Container>
          {/* Hole Nr. 2 */}
          <Container sortableChildren={true} mask={hole_masks.current[2]}>
            <MoleContainer
              stageProps={stageProps}
              emitter={gameObserver.current}
              id={2}
              // moleType={moles[2].moleType}
              xInit={hole_coords[2].x}
              yInit={hole_coords[2].y}
              moles={moles}
              setMoles={setMoles}
              setMoleCount={setMoleCount}
              // key={moles[2].key}
              haste={haste.current}
            />
            <MoleHole xInit={hole_coords[2].x} yInit={hole_coords[2].y} />
          </Container>
          {/* Hole Nr. 3 */}
          <Container sortableChildren={true} mask={hole_masks.current[3]}>
            <MoleContainer
              stageProps={stageProps}
              emitter={gameObserver.current}
              id={3}
              // moleType={moles[3].moleType}
              xInit={hole_coords[3].x}
              yInit={hole_coords[3].y}
              moles={moles}
              setMoles={setMoles}
              setMoleCount={setMoleCount}
              // key={moles[3].key}
              haste={haste.current}
            />
            <MoleHole xInit={hole_coords[3].x} yInit={hole_coords[3].y} />
          </Container>
          {/* Hole Nr. 4 */}
          <Container sortableChildren={true} mask={hole_masks.current[4]}>
            <MoleContainer
              stageProps={stageProps}
              emitter={gameObserver.current}
              id={4}
              // moleType={moles[4].moleType}
              xInit={hole_coords[4].x}
              yInit={hole_coords[4].y}
              moles={moles}
              setMoles={setMoles}
              setMoleCount={setMoleCount}
              // key={moles[4].key]}
              haste={haste.current}
            />
            <MoleHole xInit={hole_coords[4].x} yInit={hole_coords[4].y} />
          </Container>
        </Container>
      </Stage>
    </div>
  );
}
