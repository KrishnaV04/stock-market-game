import random
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import json

def fetch_symbol_data(ticker):
    stock_data = yf.download(ticker, interval='1d', period="6mo")
    
    if stock_data.empty:
        raise Exception("Failed to download from Yahoo Finance")
    
    stock_data.columns = stock_data.columns.droplevel(1)
    stock_data['Datetime'] = stock_data.index

    return stock_data

if __name__ == "__main__":
    ticker = 'AAPL'
    data = fetch_symbol_data(ticker)
    data["Datetime"] = data["Datetime"].astype(int) // 10**6
    data = [
    {"x": timestamp, "y": [round(open_, 2), round(high, 2), round(low, 2), round(close, 2)]}
    for timestamp, open_, high, low, close in zip(data["Datetime"], data["Open"], data["High"], data["Low"], data["Close"])
    ]
    
    with open(f"src/data/{ticker}_formatted_stock_data.json", "w") as f:
        json.dump(data, f)