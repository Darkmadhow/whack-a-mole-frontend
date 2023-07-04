import React, { useContext, useEffect } from "react";
import AudioPlayerContext from "../utils/audioPlayerContext";

export default function Tutorial() {
  const audioPlayer = useContext(AudioPlayerContext);

  useEffect(() => {
    if (audioPlayer) audioPlayer.play();

    return () => {
      if (audioPlayer) audioPlayer.pause();
    };
  }, []);
  return <div>Tutorial</div>;
}
