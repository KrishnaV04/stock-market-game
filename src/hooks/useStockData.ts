import { useEffect, useState } from "react";
import { StockData } from "../components/types";

export const useStockData = () => {
  const [completeData, setCompleteData] = useState<StockData[]>([]);

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

  return completeData;
};
