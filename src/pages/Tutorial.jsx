import React, { useContext, useEffect } from 'react';
import AudioPlayerContext from '../utils/audioPlayerContext';
import { UserContext } from '../userContext';
import NavBar from '../components/NavBar';
import bunny from '../assets/img/bunny.png';
import shroom from '../assets/img/shroom.png';
import cooldowns from '../assets/img/cooldowns_tutorial.png';
import '../styles/tutorial.css';

export default function Tutorial() {
  const audioPlayer = useContext(AudioPlayerContext);
  const { isMuted } = useContext(UserContext);

  useEffect(() => {
    if (isMuted) audioPlayer.pause();
    else audioPlayer.play();
  }, [isMuted]);

  useEffect(() => {
    if (audioPlayer && !isMuted) audioPlayer.play();

    return () => {
      if (audioPlayer) audioPlayer.pause();
    };
  }, []);

  return (
    <div className="tutorial-page">
      <NavBar />
      <div className="tutorial">
        <div className="explanation text-box">
          <h2>Whack-a-Guide</h2>
          Your goal is to hit as many moles as possible. There are several mole
          types that behave differently, so keep your eyes open. As the game
          gets faster, you get offered upgrades to help you - find your
          favourite combination or try something different every time.
        </div>
        <div className="inputs text-box">
          <p>
            <b>Left click:</b> Swing the Hammer
          </p>
          <p>
            <b>Scroll</b> mousewheel to cycle through available upgrades
          </p>
          <p>
            <b>Right click:</b> Place the selected upgrade
          </p>
        </div>
        <div className="cooldowns text-box">
          On the right are your chosen upgrades. Notice the red cooldown timer -
          some of your choices have a limit of how fast you can deploy them!
          <img src={cooldowns} alt="Mind your cooldowns" />
        </div>
        <div className="moles text-box">
          Beware of these:
          <figure>
            <img src={bunny} alt="Cute bunny" />
            <figcaption>
              <b>The bunny</b>. Hit me and you lose lives or valuable time
            </figcaption>
          </figure>
          <figure>
            <img src={shroom} alt="Icky poisonous shroom" />
            <figcaption>
              <b>The shroom</b>. Hitting me will stun you for quite some time
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
