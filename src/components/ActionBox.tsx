// NOT BEING USED

import { useState } from "react";
import { totalTurns } from "./constants";
import { Balance } from "./types";

const GameActions = ({
  curPrice,
  balance,
  setBalance,
  turn,
  setTurn,
}: {
  curPrice: number;
  balance: Balance;
  setBalance: (balance: Balance) => void;
  turn: number;
  setTurn: (turn: number) => void;
}) => {
  const [gameEnded, setGameEnded] = useState(false);
  const percent = 0.1;

  const handleBuy = () => {
    if (gameEnded) return;
    const stocks = (balance.cash * percent) / curPrice;
    setBalance({
      ...balance,
      stock: balance.stock + stocks,
      cash: balance.cash - stocks * curPrice,
    });
    console.log(`Buying ${stocks} shares at ${curPrice} each`);

    setTurn(turn + 1);
    checkGameStatus();
  };

  // Function to handle sell action
  const handleSell = () => {
    if (gameEnded || balance.stock === 0) return;
    console.log(`Selling ${balance.stock} shares at ${curPrice} each`);
    setBalance({
      ...balance,
      cash: balance.cash + balance.stock * curPrice,
      stock: 0,
    });

    setTurn(turn + 1);
    checkGameStatus();
  };

  // Function to handle "Do Nothing" action
  const handleDoNothing = () => {
    if (gameEnded) return;
    console.log("Doing nothing");
    setTurn(turn + 1);
    checkGameStatus();
  };

  // Check if game ends after each action
  const checkGameStatus = () => {
    if (turn === totalTurns - 1) {
      setGameEnded(true);
      setBalance({
        ...balance,
        cash: balance.cash + balance.stock * curPrice,
        stock: 0,
      });
      console.log(`Selling all holdings`);
      console.log("Game Over!");
    }
  };

  return (
    <div>
      <h3>Turn: {turn === -1 ? "NA" : turn}</h3>

      <button
        onClick={() => {
          setTurn(turn + 1);
        }}
        disabled={turn !== -1}
      >
        Start Game
      </button>

      {/* Action buttons */}
      <button onClick={handleBuy} disabled={gameEnded || turn === -1}>
        Buy Shares
      </button>
      <button
        onClick={handleSell}
        disabled={gameEnded || balance.stock === 0 || turn === -1}
      >
        Sell Shares
      </button>
      <button onClick={handleDoNothing} disabled={gameEnded || turn === -1}>
        Do Nothing
      </button>

      {/* Display balance */}
      <div>
        <h5>Balance: ${balance.cash}</h5>
      </div>

      {/* Game End message */}
      {gameEnded && <h3>Game Over! Thanks for playing.</h3>}
    </div>
  );
};

export default GameActions;
