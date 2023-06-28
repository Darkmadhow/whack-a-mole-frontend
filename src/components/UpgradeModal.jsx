import React from "react";
import '../styles/UpgradeModal.css';

export default function UpgradeModal({stage, gameObserver, subtractLife}) {
    function onClick(){
        gameObserver.current.emit('reset');
        stage.start();
        gameObserver.current.on("evaded",subtractLife);
    }
  return (
    <div className="upgrade-modal">
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h2 className="font-bold text-lg">Choose an Upgrade!</h2>
          <p className="py-4">Press ESC key or click outside to close</p>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClick}>Upgrade 1</button>
          <button onClick={onClick}>Upgrade 2</button>
        </form>
      </dialog>
    </div>
  );
}
