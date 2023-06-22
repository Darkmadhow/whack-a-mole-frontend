import React, { useState, useRef } from 'react';
import { Stage, Sprite, useTick, Container } from '@pixi/react';
import { Texture } from 'pixi.js';
import { EventEmitter } from '@pixi/utils';
import MoleStandard from '../assets/game/MoleStandard';
import '../styles/game.css';
import MoleHole from '../assets/game/MoleHole';
import MoleContainer from '../assets/game/MoleContainer';

export default function StandardGame() {
  const gameObserver = useRef(new EventEmitter());

  const stageProps = {
    height: 900,
    width: 1400,
    options: {
      backgroundAlpha: 0,
    },
  };

  gameObserver.current.on('dead', (e) => {
    console.log(e);
  });

  return (
    <div className="game">
      <Stage {...stageProps}>
        <Sprite texture={Texture.WHITE} width={1} height={1} />
        <Container sortableChildren={true}>
          <MoleContainer stageProps={stageProps} gameObserver={gameObserver} />
          <MoleHole
            xInit={stageProps.width / 2}
            yInit={stageProps.height / 2}
          />
        </Container>
        {/* <MoleStandard
          xInit={stageProps.width / 4}
          yInit={stageProps.height / 3}
          emitter={gameObserver.current}
          id={2}
        /> */}
      </Stage>
    </div>
  );
}
