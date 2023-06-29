import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { NavLink } from "react-router-dom";
import { Stage, Sprite, Container } from "@pixi/react";
import { Texture, Graphics } from "pixi.js";
import { EventEmitter } from "@pixi/utils";
import { UserContext } from "../userContext";
import { uploadHighScore } from "../utils/scores";
import UpgradeModal from "../components/UpgradeModal";
import MoleHole from "../assets/game/MoleHole";
import MoleContainer from "../assets/game/MoleContainer";
import Mallet from "../assets/game/Mallet";
import Reticle from "../assets/game/Reticle";
import rocketHammer from "../assets/img/mallet_rocket.png";
import spikeHammer from "../assets/img/mallet_spikey.png";
import droneHammer from "../assets/img/drone.png";
import bomb from "../assets/img/bomb.png";
import cover from "../assets/img/cover.png";
import trap from "../assets/img/trap.png";
import "../styles/game.css";

export default function StandardGame() {
  /* ------------------------- INITIAL VALUES SETUP ------------------------- */
  /* ------------------------- -------------------- ------------------------- */
  //the stage component including all our sprites
  const [stage, setStage] = useState();
  //the event emitter that will handle all game interactions
  const gameObserver = useRef(new EventEmitter());
  //initial score, lives and difficulty level
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  //difficulty speed multiplier
  const haste = useRef(1);
  //swing timer values
  const [cooldownActive, setCooldownActive] = useState(false); //the swing timer check
  const swingTimerDuration = 800; //the swing timer cooldown in ms

  //the upgrades chosen by the user stored as string array and available upgrades
  const [chosenUpgrades, setChosenUpgrades] = useState([]);
  const [availableHammerUpgrades, setAvailableHammerUpgrades] = useState([
    { name: "rocket_hammer", asset: rocketHammer },
    { name: "spike_hammer", asset: spikeHammer },
  ]);
  const [[option1, option2], setOptions] = useState([
    { name: null, asset: null },
    { name: null, asset: null },
  ]);
  const [availableDeployableUpgrades, setAvailableDeployableUpgrades] =
    useState([
      { name: "bomb", asset: bomb },
      { name: "cover", asset: cover },
      { name: "trap", asset: trap },
      { name: "drone", asset: droneHammer },
    ]);
  //if a deployable upgrade has been chosen, mousewheel scrolling will set this rotating through chosen upgrades
  const [rightClickDeploy, setRightClickDeploy] = useState(null);

  //subscribe to mole events
  const { token } = useContext(UserContext);
  useEffect(() => {
    gameObserver.current.on("dead", updateScore);
    gameObserver.current.on("evaded", subtractLife);
    gameObserver.current.on("reset", replaceAllMoles);
    return () => {
      gameObserver.current.off("dead", updateScore);
      gameObserver.current.off("evaded", subtractLife);
      gameObserver.current.off("reset", replaceAllMoles);
    };
  }, []);

  /* ------------------------------ SCORING FUNCTIONS ------------------------------ */
  /* ------------------------------ ----------------- ------------------------------ */
  function updateScore(e) {
    setScore((prev) => prev + e.value);
  }

  const subtractLife = useCallback(() => {
    setLives((prev) => prev - 1);
  }, [lives]);

  /* ------------------------------ MOLE HANDLING ------------------------------ */
  /* ------------------------------ ------------- ------------------------------ */
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
    { moleType: "standard", key: 1000 },
    { moleType: "standard", key: 2000 },
    { moleType: "standard", key: 3000 },
    { moleType: "standard", key: 4000 },
    { moleType: "standard", key: 5000 },
  ]);

  function replaceAllMoles() {
    const molesTemp = moles.map((mole) => {
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

      mole.moleType = newMole;
      mole.key++;

      return mole;
    });

    setMoles(molesTemp);
  }

  /* ----------------------------------- STAGE SETTINGS ----------------------------------- */
  /* ----------------------------------- -------------- ----------------------------------- */
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

  /* ------------------------------ UPGRADE FUNCTIONALITY ------------------------------ */
  /* ------------------------------ --------------------- ------------------------------ */

  /*
   * increases difficulty over time and triggers upgrade selection
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

    //increase difficulty every 10 moles, open modal to offer an upgrade
    if (!(molecounter % 10)) {
      gameObserver.current.off("evaded", subtractLife);
      haste.current *= 1.03;
      setLevel((prev) => prev + 1);
      gameObserver.current.emit("reset_incoming");
      stage.stop();
      setOptions(getUpgradeOptions());
      setTimeout(() => {
        window.my_modal_2.showModal();
      }, 1500);
    }
  }, [mole_count]);

  function getUpgradeOptions() {
    //no hammer upgade chosen? offer hammers first
    if (availableHammerUpgrades.length > 1) {
      const [a, b] = getRandomIndices(availableHammerUpgrades);
      const optionA = availableHammerUpgrades[a];
      const optionB = availableHammerUpgrades[b];
      //allow only one hammer upgrade: empty array upon offering the choice
      setAvailableHammerUpgrades([]);
      return [optionA, optionB];
    }
    //if less than 2 hammer upgrades are left, offer deployable object instead
    const [a, b] = getRandomIndices(availableDeployableUpgrades);
    const optionA = availableDeployableUpgrades[a];
    const optionB = availableDeployableUpgrades[b];
    //if no upgrades are left, return empty upgrades
    if (!optionA && !optionB)
      return [
        { name: "No Upgrade left", asset: null },
        { name: "No Upgrade left", asset: null },
      ];

    return [optionA, optionB];
  }

  /*
   * cycleRightClickDeploy: sets the current deployable object to the next one in the chosenUpgrades Array, excluding hammer upgrades
   */
  function cycleRightClickDeploy() {
    console.log("cycling");
    const upgrades = chosenUpgrades.filter(
      (upgrade) =>
        upgrade.name !== "spike_hammer" && upgrade.name !== "rocket_hammer"
    );
    const currentIndex = upgrades.findIndex(
      (upgrade) => upgrade.name === rightClickDeploy.name
    );

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % upgrades.length;
      const nextUpgrade = upgrades[nextIndex];
      setRightClickDeploy(nextUpgrade);
      console.log("Switched to: ", nextUpgrade);
    }
  }

  /*
   * handleUpgradeSelection: The callback being executed by the upgrade choice modal
   * params: userChoice, the Upgrade Object the user has clicked
   * return: returns an array of 2 upgrade Objects
   */
  function handleUpgradeSelection(userChoice) {
    //if no upgrades are left, we get an empty asset, don't to anything
    if (userChoice.asset == null) return;

    setChosenUpgrades((prev) => [...prev, userChoice]);
    if (availableDeployableUpgrades.includes(userChoice)) {
      const index = availableDeployableUpgrades.indexOf(userChoice);
      setAvailableDeployableUpgrades(
        availableDeployableUpgrades.toSpliced(index, 1)
      );
    }
  }

  /* ------------------------------ HELPER FUNCTIONS ------------------------------ */
  /* ------------------------------ ---------------- ------------------------------ */
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

  // Function to generate a random number within a range
  function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
   * getRandomIndices: select 2 random indices from an array which are guaranteed to be different
   * params: array, the array to pick two indices from
   * returns: [index1, index2], an array with the 2 selected indices which are distinct
   */
  const getRandomIndices = (array) => {
    const length = array.length;

    if (length == 0) {
      // If the array has no entries, return false in a safe way
      return [false, false];
    }
    if (length < 2) {
      // If the array has less than 2 entries, return the only available index twice
      return [0, 0];
    }

    // Generate the first random index
    let index1 = getRandomIndex(0, length - 1);

    // Generate the second random index, ensuring it is distinct from the first index
    let index2;
    do {
      index2 = getRandomIndex(0, length - 1);
    } while (index2 === index1);

    return [index1, index2];
  };

  /* ------------------------------ VISUAL OUTPUT ------------------------------ */
  /* ------------------------------ ------------- ------------------------------ */
  //game over at 0 lives
  if (lives <= 0) {
    //upload Highscore to the backend
    uploadHighScore(token, { score: score, gamemode: "standard" });

    return (
      <div className="game">
        <div className="game-over-screen">
          <h2>You got {score} points</h2>
          {/* TODO: Load Highscore placement */}

          <NavLink to="/">
            <button>Back to Menu</button>
          </NavLink>
          <Stage
            width={1}
            height={1}
            options={{ backgroundAlpha: 0 }}
            onMount={setStage}
          />
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
        <div className="level">Stage: {level}</div>
      </div>
      <Stage {...stageProps} onMount={setStage}>
        <Container sortableChildren={true}>
          <Sprite texture={Texture.WHITE} width={1} height={1} />
          <Mallet chosenUpgrades={chosenUpgrades} />
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
              activeUpgrades={chosenUpgrades}
              swingTimerDuration={swingTimerDuration}
              cooldownActive={cooldownActive}
              setCooldownActive={setCooldownActive}
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
              activeUpgrades={chosenUpgrades}
              swingTimerDuration={swingTimerDuration}
              cooldownActive={cooldownActive}
              setCooldownActive={setCooldownActive}
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
              activeUpgrades={chosenUpgrades}
              swingTimerDuration={swingTimerDuration}
              cooldownActive={cooldownActive}
              setCooldownActive={setCooldownActive}
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
              activeUpgrades={chosenUpgrades}
              swingTimerDuration={swingTimerDuration}
              cooldownActive={cooldownActive}
              setCooldownActive={setCooldownActive}
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
              activeUpgrades={chosenUpgrades}
              swingTimerDuration={swingTimerDuration}
              cooldownActive={cooldownActive}
              setCooldownActive={setCooldownActive}
            />
            <MoleHole xInit={hole_coords[4].x} yInit={hole_coords[4].y} />
          </Container>
        </Container>
      </Stage>
      <UpgradeModal
        stage={stage}
        gameObserver={gameObserver}
        subtractLife={subtractLife}
        option1={option1}
        option2={option2}
        handleUpgradeSelection={handleUpgradeSelection}
      />
    </div>
  );
}
