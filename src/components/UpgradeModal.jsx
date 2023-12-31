import React from "react";
import "../styles/UpgradeModal.css";

export default function UpgradeModal({
  app,
  gameObserver,
  subtractLife,
  option1,
  option2,
  handleUpgradeSelection,
}) {
  function onClick(userChoice) {
    gameObserver.current.emit("reset");
    app.start();
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
              style={{
                backgroundImage: `url(${option1.asset})`,
                backgroundSize: "cover",
              }}
            >
              <div className="upgrade-name">{option1.descriptive_name}</div>
              <div className="upgrade-desc">{option1.desc}</div>
            </button>
            <button
              onClick={() => onClick(option2)}
              style={{
                backgroundImage: `url(${option2.asset})`,
                backgroundSize: "cover",
              }}
            >
              <div className="upgrade-name">{option2.descriptive_name}</div>
              <div className="upgrade-desc">{option2.desc}</div>
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
