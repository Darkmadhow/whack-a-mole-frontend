import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { NavLink } from "react-router-dom";
import { Stage, Sprite, Container } from "@pixi/react";
import { Texture, Graphics, Sprite as PIXISprite } from "pixi.js";
import { EventEmitter } from "@pixi/utils";
import { sound } from "@pixi/sound";
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
import trap_foreground from "../assets/img/trap_foreground.png";
import "../styles/game.css";
import { globalMoleSounds } from "../utils/sounds";

export default function StandardGame() {
  /* ------------------------- INITIAL VALUES SETUP ------------------------- */
  /* ------------------------- -------------------- ------------------------- */
  //the app component including all our sprites
  const [app, setApp] = useState();
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
  const SWING_TIMER_DURATION = 800; //the swing timer cooldown in ms
  const DEPLOY_CD = 5000; //the time players have to wait between deployables
  const MAX_TOLERANCE = 150; //the distance in pixels within the player has to rightclick to place something on a hole
  const BOMB_TIMER = 4000; //time before bomb explodes

  const [isGameOver, setIsGameOver] = useState(false);

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
      // { name: "cover", asset: cover }, //TODO: What does cover do? How will it work?
      { name: "trap", asset: trap },
      // { name: "drone", asset: droneHammer },
    ]);
  //if a deployable upgrade has been chosen, mousewheel scrolling will set this rotating through chosen upgrades
  const [rightClickDeploy, setRightClickDeploy] = useState(null);
  const [pluggedHoles, setPluggedHoles] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [deployableCooldown, setDeployableCooldown] = useState(false);
  const [rank, setRank] = useState("... let me see");

  const { token, isMuted, setIsMuted } = useContext(UserContext);

  //subscribe to mole events
  useEffect(() => {
    gameObserver.current.on("dead", updateScore);
    gameObserver.current.on("evaded", subtractLife);
    gameObserver.current.on("reset", replaceAllMoles);

    sound.add(globalMoleSounds);

    //prevent right-click to open context menu
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      gameObserver.current.off("dead", updateScore);
      gameObserver.current.off("evaded", subtractLife);
      gameObserver.current.off("reset", replaceAllMoles);

      sound.removeAll();

      document.removeEventListener("contextmenu", handleContextMenu);
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

  useEffect(() => {
    if (lives <= 0) setIsGameOver(true);
  }, [lives]);

  useEffect(() => {
    if (!isMuted && isGameOver) sound.play("gameover");
    if (isGameOver && token) {
      (async () => {
        const res = await uploadHighScore(token, {
          score: score,
          gamemode: "standard",
        });
        setRank(res.rank + 1);
      })();
    }
  }, [isGameOver]);

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
    height: 800,
    width: 1400,
    options: {
      backgroundAlpha: 0,
    },
  };
  const hole_coords = [
    { x: 400, y: 300 },
    { x: 700, y: 300 },
    { x: 1000, y: 300 },
    { x: 500, y: 500 },
    { x: 800, y: 500 },
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
    if (!(molecounter % 10)) haste.current *= 1.05;
    if (!(molecounter % 20)) {
      setLevel((prev) => prev + 1);
      const options = getUpgradeOptions();
      if (!options) return;
      if (!isMuted) sound.play("powerup");
      gameObserver.current.off("evaded", subtractLife);
      gameObserver.current.emit("reset_incoming");
      setOptions(options);
      app.stop();
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
    if (!optionA && !optionB) return false;

    return [optionA, optionB];
  }

  //runs cycleRightClickDeploy upon user scrolling the mouse
  function handleMousewheel(e) {
    // e.preventDefault();
    cycleRightClickDeploy(e.deltaY);
  }

  /*
   * handleRightclick: places the currently selected deployable upgrade on the nearest mole hole
   */
  function handleRightclick(x, y, id) {
    //if no deployable upgrade has been chosen so far or the cooldown is running, or one is already there, stop here
    if (!rightClickDeploy || deployableCooldown || pluggedHoles[id]) return;

    //select the right hole to put the deployable on
    const container = app.stage.children[0].children[id];

    const deploy = PIXISprite.from(rightClickDeploy.asset);
    deploy.anchor.set(0.5);
    deploy.x = x;
    deploy.y = y;
    deploy.name = rightClickDeploy.name;
    deploy.id = id;

    //find out on which layer the deployable needs to be rendered
    switch (rightClickDeploy.name) {
      case "bomb":
        deploy.zIndex = 1;
        gameObserver.current.once("boom", function (e) {
          // setPluggedHoles({ ...pluggedHoles, [e.source]: null });
          // deploy.destroy();
          container.removeChild(deploy);
        });
        setTimeout(() => {
          gameObserver.current.emit("boom", { source: id });
          if (!isMuted) sound.play("bomb");
        }, BOMB_TIMER);
        break;
      case "cover":
        deploy.zIndex = 3;
        break;
      case "trap":
        deploy.zIndex = 0;
        deploy.y -= 10;
        //add foreground
        const foreground = createTrapChild(x, y);
        container.addChild(foreground);
        deploy.dependantChild = foreground;
        break;
      //the drone gets a bit more complicated...
      case "drone":
        deploy.zIndex = 3;
        deployDrone(deploy);
        return;
    }

    //plug the deployable into the hole and trigger the cooldown
    triggerDeployCooldown();
    setPluggedHoles({ ...pluggedHoles, [id]: deploy });
    container.addChild(deploy);
  }

  function deployDrone(drone) {
    triggerDeployCooldown();
  }

  function createTrapChild(x, y) {
    const trap_fore = PIXISprite.from(trap_foreground);
    trap_fore.anchor.set(0.5);
    trap_fore.x = x;
    trap_fore.y = y - 10;
    trap_fore.zIndex = 3;
    return trap_fore;
  }

  /*
   * cycleRightClickDeploy: sets the current deployable object to the next one in the chosenUpgrades Array, excluding hammer upgrades
   */
  function cycleRightClickDeploy(deltaY) {
    const scrollDirection = deltaY < 0 ? -1 : 1;
    //exclude hammer upgrades
    const upgrades = chosenUpgrades.filter(
      (upgrade) =>
        upgrade.name !== "spike_hammer" && upgrade.name !== "rocket_hammer"
    );
    //if there's just one upgrade, pick that
    if (upgrades.length == 1) {
      setRightClickDeploy(upgrades[0]);
      return;
    }
    //otherwise, look for others to scroll to
    const currentIndex = upgrades.findIndex(
      (upgrade) => upgrade.name === rightClickDeploy.name
    );
    if (currentIndex !== -1) {
      const nextIndex =
        (currentIndex + scrollDirection + upgrades.length) % upgrades.length;
      const nextUpgrade = upgrades[nextIndex];
      setRightClickDeploy(nextUpgrade);
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

  //if a new upgrade is chosen, cycle to it
  useEffect(() => {
    cycleRightClickDeploy(1);
  }, [chosenUpgrades]);

  /* ------------------------------ HELPER FUNCTIONS ------------------------------ */
  /* ------------------------------ ---------------- ------------------------------ */

  //------------------- Animate the upgrade icons
  const [cooldownProgress, setCooldownProgress] = useState(0);

  useEffect(() => {
    if (deployableCooldown) {
      setCooldownProgress(100);

      const intervalId = setInterval(() => {
        setCooldownProgress((prevProgress) =>
          prevProgress > 2 ? prevProgress - 1 : 0
        );
      }, DEPLOY_CD / 100);

      return () => clearInterval(intervalId);
    }
  }, [deployableCooldown]);
  //---------------------------------------------

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

  //prevents the Contextmenu from opening upon Rightclick
  function handleContextMenu(e) {
    e.preventDefault();
  }

  //triggers the cooldown on the deployable upgrades
  function triggerDeployCooldown() {
    setDeployableCooldown(true);
    setTimeout(() => {
      setDeployableCooldown(false);
    }, DEPLOY_CD);
  }

  /* ------------------------------ VISUAL OUTPUT ------------------------------ */
  /* ------------------------------ ------------- ------------------------------ */

  //game over at 0 lives
  if (isGameOver) {
    return (
      <div className="game">
        <div className="game-over-screen">
          <h1>Game Over</h1>
          {chosenUpgrades.length > 0 ? (
            <section className="chosen-upgrades-gameover">
              {chosenUpgrades.map((upgrade) => (
                <figure className="upgrade-asset-container">
                  <img
                    src={upgrade.asset}
                    alt={upgrade.name}
                    key={upgrade.name}
                    className="upgrade-asset"
                  />
                </figure>
              ))}
            </section>
          ) : (
            ""
          )}
          <h2>You got {score} points</h2>
          <h3>This got you to Rank {rank}</h3>
          <NavLink to="/">
            <button>Back to Menu</button>
          </NavLink>
          <a href="/standardgame">
            <button>Play again</button>
          </a>
          <Stage
            width={1}
            height={1}
            options={{ backgroundAlpha: 0 }}
            onMount={setApp}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="game" onWheel={handleMousewheel}>
      <div className="game-stats">
        <NavLink to="/modeselection">Back</NavLink>
        <div className="score-display">Score: {score}</div>
        <div className="lives">Lives: {lives}</div>
        <div className="level">Stage: {level}</div>
        {isMuted ? (
          <img
            src="src/assets/img/no-sound.png"
            alt="mute"
            className="muteBtn"
            onPointerDown={() => setIsMuted(!isMuted)}
          />
        ) : (
          <img
            src="src/assets/img/sound.png"
            alt="unmute"
            className="muteBtn"
            onPointerDown={() => setIsMuted(!isMuted)}
          />
        )}
      </div>
      <div className="game-container">
        <div className="chosen-upgrades">
          {chosenUpgrades.map((upgrade) => (
            <img
              src={upgrade.asset}
              className={`${
                upgrade.name === rightClickDeploy?.name ? "selected" : ""
              } ${deployableCooldown ? "cooldown" : ""}`}
              key={upgrade.name}
              style={
                upgrade.name === rightClickDeploy?.name
                  ? {
                      backgroundImage: `conic-gradient(#f00 0% ${
                        100 - cooldownProgress
                      }%, transparent ${100 - cooldownProgress}% 100%)`,
                    }
                  : {}
              }
            />
          ))}
        </div>
        <Stage {...stageProps} onMount={setApp}>
          <Container sortableChildren={true}>
            <Sprite texture={Texture.WHITE} width={1} height={1} zIndex={99} />
            <Mallet
              chosenUpgrades={chosenUpgrades}
              emitter={gameObserver.current}
              ANIMATION_DURATION={SWING_TIMER_DURATION}
            />
            <Reticle />
            {/* Hole Nr. 0 */}
            <Container sortableChildren={true} mask={hole_masks.current[0]}>
              <MoleContainer
                stageProps={stageProps}
                emitter={gameObserver.current}
                id={0}
                xInit={hole_coords[0].x}
                yInit={hole_coords[0].y}
                moles={moles}
                setMoles={setMoles}
                setMoleCount={setMoleCount}
                haste={haste.current}
                activeUpgrades={chosenUpgrades}
                swingTimerDuration={SWING_TIMER_DURATION}
                cooldownActive={cooldownActive}
                setCooldownActive={setCooldownActive}
                plugged={pluggedHoles}
                unplugger={setPluggedHoles}
                isMuted={isMuted}
              />
              <MoleHole
                xInit={hole_coords[0].x}
                yInit={hole_coords[0].y}
                id={0}
                handler={handleRightclick}
              />
            </Container>
            {/* Hole Nr. 1 */}
            <Container sortableChildren={true} mask={hole_masks.current[1]}>
              <MoleContainer
                stageProps={stageProps}
                emitter={gameObserver.current}
                id={1}
                xInit={hole_coords[1].x}
                yInit={hole_coords[1].y}
                moles={moles}
                setMoles={setMoles}
                setMoleCount={setMoleCount}
                haste={haste.current}
                activeUpgrades={chosenUpgrades}
                swingTimerDuration={SWING_TIMER_DURATION}
                cooldownActive={cooldownActive}
                setCooldownActive={setCooldownActive}
                plugged={pluggedHoles}
                unplugger={setPluggedHoles}
                isMuted={isMuted}
              />
              <MoleHole
                xInit={hole_coords[1].x}
                yInit={hole_coords[1].y}
                id={1}
                handler={handleRightclick}
              />
            </Container>
            {/* Hole Nr. 2 */}
            <Container sortableChildren={true} mask={hole_masks.current[2]}>
              <MoleContainer
                stageProps={stageProps}
                emitter={gameObserver.current}
                id={2}
                xInit={hole_coords[2].x}
                yInit={hole_coords[2].y}
                moles={moles}
                setMoles={setMoles}
                setMoleCount={setMoleCount}
                haste={haste.current}
                activeUpgrades={chosenUpgrades}
                swingTimerDuration={SWING_TIMER_DURATION}
                cooldownActive={cooldownActive}
                setCooldownActive={setCooldownActive}
                plugged={pluggedHoles}
                unplugger={setPluggedHoles}
                isMuted={isMuted}
              />
              <MoleHole
                xInit={hole_coords[2].x}
                yInit={hole_coords[2].y}
                id={2}
                handler={handleRightclick}
              />
            </Container>
            {/* Hole Nr. 3 */}
            <Container sortableChildren={true} mask={hole_masks.current[3]}>
              <MoleContainer
                stageProps={stageProps}
                emitter={gameObserver.current}
                id={3}
                xInit={hole_coords[3].x}
                yInit={hole_coords[3].y}
                moles={moles}
                setMoles={setMoles}
                setMoleCount={setMoleCount}
                haste={haste.current}
                activeUpgrades={chosenUpgrades}
                swingTimerDuration={SWING_TIMER_DURATION}
                cooldownActive={cooldownActive}
                setCooldownActive={setCooldownActive}
                plugged={pluggedHoles}
                unplugger={setPluggedHoles}
                isMuted={isMuted}
              />
              <MoleHole
                xInit={hole_coords[3].x}
                yInit={hole_coords[3].y}
                id={3}
                handler={handleRightclick}
              />
            </Container>
            {/* Hole Nr. 4 */}
            <Container sortableChildren={true} mask={hole_masks.current[4]}>
              <MoleContainer
                stageProps={stageProps}
                emitter={gameObserver.current}
                id={4}
                xInit={hole_coords[4].x}
                yInit={hole_coords[4].y}
                moles={moles}
                setMoles={setMoles}
                setMoleCount={setMoleCount}
                haste={haste.current}
                activeUpgrades={chosenUpgrades}
                swingTimerDuration={SWING_TIMER_DURATION}
                cooldownActive={cooldownActive}
                setCooldownActive={setCooldownActive}
                plugged={pluggedHoles}
                unplugger={setPluggedHoles}
                isMuted={isMuted}
              />
              <MoleHole
                xInit={hole_coords[4].x}
                yInit={hole_coords[4].y}
                id={4}
                handler={handleRightclick}
              />
            </Container>
          </Container>
        </Stage>
      </div>
      <UpgradeModal
        app={app}
        gameObserver={gameObserver}
        subtractLife={subtractLife}
        option1={option1}
        option2={option2}
        handleUpgradeSelection={handleUpgradeSelection}
      />
    </div>
  );
}
