import StockChart from "./StockChart";
import GameActions from "./ActionBox";
import { useEffect, useState } from "react";
import { StockData, Balance } from "./types";
import { totalTurns } from "./constants";

function Game() {
  const [turn, setTurn] = useState(-1); // turn number
  const [startIndex, setStartIndex] = useState(0);
  const [completeData, setCompleteData] = useState<StockData[]>([]); // stock data
  const [balance, setBalance] = useState<Balance>({
    cash: 100000,
    total: 100000,
    stock: 0,
  });
  const [curPrice, setCurPrice] = useState(1);

  useEffect(() => {
    fetch("/AAPL_formatted_stock_data.json") // sets data
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

  useEffect(() => {
    setStartIndex(
      Math.floor(Math.random() * (completeData.length - totalTurns - 10) + 10)
    );
  }, [completeData]);

  useEffect(() => {
    if (completeData.length > 0 && startIndex + turn < completeData.length) {
      const currentData = completeData[startIndex + turn];
      if (currentData && currentData.y) {
        setCurPrice(currentData.y[3]);
      }
    }
  }, [turn, startIndex]);

  return (
    <>
      <StockChart startIndex={startIndex} turn={turn} allData={completeData} />
      <GameActions
        curPrice={curPrice}
        balance={balance}
        setBalance={setBalance}
        turn={turn}
        setTurn={setTurn}
      />
    </>
  );
}

export default Game;
