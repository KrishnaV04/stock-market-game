import StockChart from "./StockChart";
import StartGameButton from "./StartGameButton";
import { useEffect, useMemo, useState } from "react";
import { StockData, Balance, Status } from "./types";
import { totalTurns } from "./constants";
import DataDisplay from "./DataDisplay";

function Game() {
  const [completeData, setCompleteData] = useState<StockData[]>([]); // stock data
  const [turn, setTurn] = useState(0); // turn number
  const [percent, setPercent] = useState(50);
  const [gameStatus, setGameStatus] = useState<Status>(Status.Start);
  const [balance, setBalance] = useState<Balance>({
    cash: 100000,
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

  const handleBuy = (percent: number) => {
    const shares = ((percent / 100) * balance.cash) / curPrice;
    setBalance({
      ...balance,
      stock: balance.stock + shares,
      cash: balance.cash - shares * curPrice,
    });
    console.log(`Buying ${shares} shares at ${curPrice} each`);
  };

  const handleSell = (percent: number) => {
    const shares = (percent / 100) * balance.stock;
    console.log(`Selling ${shares} shares at ${curPrice} each`);
    setBalance({
      ...balance,
      cash: balance.cash + shares * curPrice,
      stock: balance.stock - shares,
    });
  };

  if (turn === totalTurns && gameStatus !== Status.End) {
    setGameStatus(Status.End);
    console.log(`Selling all holdings`);
    balance.stock !== 0 ? handleSell(100) : null;
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
    <div className="container mt-5 d-flex flex-column justify-content-start align-items-center vh-100">
      <h4>Mystery S&P 500 Stock</h4>
      <StockChart
        startIndex={startIndex - 10}
        endIndex={turn + startIndex + 1}
        allData={completeData}
      />
      <div className="d-flex flex-row gap-2">
        <h5 className="text-muted">Turn:</h5>
        <h5 className="fw-bold">
          {turn} / {totalTurns}
        </h5>
      </div>

      <div className="d-flex flex-row align-items-center align-items-start gap-4 mt-4 w-100 justify-content-center">
        <DataDisplay
          cashBalance={balance.cash}
          stockBalance={balance.stock}
          turn={turn}
          totalMoney={balance.cash + balance.stock * curPrice}
          netGain={balance.cash + balance.stock * curPrice - 100000}
        />

        <div className="d-flex flex-column align-items-center gap-3 mt-3">
          <label htmlFor="percent-slider" className="mb-2">
            Choose Percentage: <span className="fw-bold">{percent}%</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="10"
            max="100"
            step="10"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
          />

          {/* Action Buttons */}
          <div className="d-flex justify-content-center  gap-3">
            <button
              className="btn btn-success"
              onClick={() => {
                handleBuy(percent);
                incrementGameTime();
              }}
              disabled={
                gameStatus === Status.End || percent === 0 || balance.cash === 0
              }
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
                handleSell(percent);
                incrementGameTime();
              }}
              disabled={
                gameStatus === Status.End ||
                percent === 0 ||
                balance.stock === 0
              }
            >
              Sell Shares
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 text-start"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        <h4 className="fw-bold">Instructions</h4>
        <p className="text-muted">
          When you buy shares you will be spending 50% of your cash balance to
          buy, and when you sell shares all your stock balance will be sold. Try
          to make the most profit within {totalTurns} turns.
          <br></br>
          <br></br>
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
