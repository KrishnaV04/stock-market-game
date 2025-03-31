import React from "react";

interface StartGameButtonProps {
  onClick: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ onClick }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <button onClick={onClick} className="btn btn-info btn-lg shadow-sm">
        Start Game
      </button>
    </div>
  );
};

export default StartGameButton;
