import React, { useState, useEffect } from "react";
import axios from "axios";

interface StockData {
  date: string;
  open: number;
  close: number;
}

interface Props {
  symbol: string;
}

const StockData: React.FC<Props> = ({ symbol }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_KEY = "YOUR_RAPIDAPI_KEY";
  const API_HOST = "yahoo-finance15.p.rapidapi.com";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(
          `https://${API_HOST}/api/v1/markets/stock/historical/${symbol}`,
          {
            headers: {
              "X-RapidAPI-Key": API_KEY,
              "X-RapidAPI-Host": API_HOST,
            },
          }
        );
        const stockHistory: StockData[] = response.data.data.map(
          (item: any) => ({
            date: item.date,
            open: parseFloat(item.open),
            close: parseFloat(item.close),
          })
        );
        setData(stockHistory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  return (
    <div>
      <h2>Historical Stock Data for {symbol}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.date}: Open - {item.open}, Close - {item.close}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockData;
