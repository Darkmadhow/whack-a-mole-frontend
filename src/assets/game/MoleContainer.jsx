import MoleStandard from './MoleStandard';

export default function MoleContainer({ stageProps, gameObserver }) {
  return (
    <MoleStandard
      xInit={stageProps.width / 2}
      yInit={stageProps.height / 2}
      emitter={gameObserver.current}
      id={1}
    />
  );
}
