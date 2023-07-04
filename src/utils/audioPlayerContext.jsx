import React, { createContext, useState, useRef, useEffect } from "react";

export const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [source, setSource] = useState("");
  const [loop, setLoop] = useState(false);

  //set properties if anything changes
  useEffect(() => {
    if (audioPlayer && source) {
      audioPlayer.src = source;
      audioPlayer.loop = loop;
      audioPlayer.play();
    }
  }, [audioPlayer, source, loop]);

  const play = () => {
    if (audioPlayer) {
      audioPlayer.play();
    }
  };

  const pause = () => {
    if (audioPlayer) {
      audioPlayer.pause();
    }
  };

  //initial setup
  const setIntroAndLoop = () => {
    if (audioPlayer) {
      setSource("menu-intro.ogg");
      setLoop(false); // Play the intro only once
      audioPlayer.addEventListener("ended", () => {
        setSource("menu-loop.ogg");
        setLoop(true); // Loop the music after the intro ends
      });
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        audioPlayer,
        setAudioPlayer,
        play,
        pause,
        setSource,
        setLoop,
        setIntroAndLoop,
      }}
    >
      {children}
      <audio ref={setAudioPlayer} />
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;
