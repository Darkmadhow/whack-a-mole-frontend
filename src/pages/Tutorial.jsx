import React, { useContext, useEffect } from "react";
import AudioPlayerContext from "../utils/audioPlayerContext";
import { UserContext } from "../userContext";

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
  return <div>Tutorial</div>;
}
