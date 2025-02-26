import StockChart from "./StockChart";
import StartGameButton from "./StartGameButton";
import { useEffect, useMemo, useState } from "react";
import { StockData, Balance, Status } from "./types";
import { totalTurns } from "./constants";

function Game() {
  const [completeData, setCompleteData] = useState<StockData[]>([]); // stock data
  const [turn, setTurn] = useState(0); // turn number
  const [gameStatus, setGameStatus] = useState<Status>(Status.Start);
  const [balance, setBalance] = useState<Balance>({
    cash: 100000,
    total: 100000,
    stock: 0,
  });
  const startIndex = useMemo(() => {
    return completeData.length > 0
      ? Math.floor(Math.random() * (completeData.length - totalTurns - 10) + 10)
      : 0;
  }, [completeData]);
  const curPrice = startIndex !== 0 ? completeData[startIndex + turn]?.y[3] : 0;

  useEffect(() => {
    fetch("/AAPL_formatted_stock_data.json")
      .then((response) => response.json())
      .then((rawData) => {
        const formattedData: StockData[] = rawData.map((entry: StockData) => ({
          x: new Date(entry.x),
          y: entry.y,
        }));
        setCompleteData(formattedData);
      })
      .catch((error) => console.error("Error fetching stock data:", error));
  }, []);

  const incrementGameTime = () => {
    setTurn((turn) => (turn < totalTurns ? turn + 1 : turn));
  };

  const handleBuy = () => {
    const stocks = (balance.cash * 0.1) / curPrice;
    setBalance({
      ...balance,
      stock: balance.stock + stocks,
      cash: balance.cash - stocks * curPrice,
    });
    console.log(`Buying ${stocks} shares at ${curPrice} each`);
  };

  const handleSell = () => {
    console.log(`Selling ${balance.stock} shares at ${curPrice} each`);
    setBalance({
      ...balance,
      cash: balance.cash + balance.stock * curPrice,
      stock: 0,
    });
  };

  if (turn === totalTurns && gameStatus !== Status.End) {
    setGameStatus(Status.End);
    console.log(`Selling all holdings`);
    balance.stock !== 0 ? handleSell() : null;
  }

  if (gameStatus == Status.Start) {
    return (
      <div>
        {gameStatus === Status.Start && (
          <StartGameButton
            onClick={() => {
              setGameStatus(Status.Playing);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h4>Mystery S&P 500 Stock</h4>
      <StockChart
        startIndex={startIndex - 10}
        endIndex={turn + startIndex + 1}
        allData={completeData}
      />
      <h4>Turn: {turn}</h4>
      <h4>Cash Balance: ${balance.cash.toFixed(2)}</h4>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          className="btn btn-success"
          onClick={() => {
            handleBuy();
            incrementGameTime();
          }}
          disabled={gameStatus === Status.End}
        >
          Buy Shares
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            incrementGameTime();
          }}
          disabled={gameStatus === Status.End}
        >
          Hold Shares
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            handleSell();
            incrementGameTime();
          }}
          disabled={gameStatus === Status.End || balance.stock === 0}
        >
          Sell Shares
        </button>
      </div>
      <div
        className="mt-5 text-start"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <h4 className="fw-bold">About</h4>
        <p className="text-muted">
          This beta version of the stock market trading game simulates a random
          S&P 500 stock. Buy, hold, or sell shares as the market fluctuates
          using data from a mystery S&P 500 stock. Note: The game is still under
          construction, and more features are to be implemented.
        </p>
      </div>
    </div>
  );
}

export default Game;
