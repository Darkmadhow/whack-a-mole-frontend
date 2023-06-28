import React from "react";
import "../styles/UpgradeModal.css";

export default function UpgradeModal({
  stage,
  gameObserver,
  subtractLife,
  option1,
  option2,
  handleUpgradeSelection,
}) {
  function onClick(userChoice) {
    gameObserver.current.emit("reset");
    stage.start();
    gameObserver.current.on("evaded", subtractLife);
    handleUpgradeSelection(userChoice);
  }
  return (
    <div className="upgrade-modal">
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h2 className="font-bold text-lg">Choose an Upgrade!</h2>
          <div className="modal-action">
            <button
              onClick={() => onClick(option1)}
              style={{ backgroundImage: `url(${option1.asset})` }}
            >
              {option1.name}
            </button>
            <button
              onClick={() => onClick(option2)}
              style={{ backgroundImage: `url(${option2.asset})` }}
            >
              {option2.name}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
