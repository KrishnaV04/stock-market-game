import React from "react";
import { totalTurns } from "./constants";

interface DataDisplayProps {
  cashBalance: number;
  stockBalance: number;
  totalMoney: number;
  netGain: number;
  turn: number;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  cashBalance,
  stockBalance,
  totalMoney,
  netGain,
  turn,
}) => {
  return (
    <div
      className="card mt-4 text-center"
      style={{ maxWidth: "600px", width: "100%" }}
    >
      <div className="card-body">
        {/* Turn Counter */}
        {/* <div className="row mb-3">
          <div className="col-12">
            <h6 className="text-muted">Turn</h6>
            <h5 className="fw-bold">
              {turn} / {totalTurns}
            </h5>
          </div>
        </div> */}

        {/* Balance Data */}
        <div className="row">
          <div className="col-6">
            <h6 className="text-muted">Cash Balance</h6>
            <h5 className="fw-bold">${cashBalance.toFixed(2)}</h5>
          </div>
          <div className="col-6">
            <h6 className="text-muted">Stock Balance</h6>
            <h5 className="fw-bold text-primary">
              {stockBalance.toFixed(2)} Shares
            </h5>
          </div>
        </div>

        {/* Total Balance and Net Gain */}
        <div className="row">
          <div className="col-6">
            <h6 className="text-muted">Total Balance</h6>
            <h5
              className={`fw-bold ${
                netGain >= 0 ? "text-success" : "text-danger"
              }`}
            >
              ${totalMoney.toFixed(2)}
            </h5>
          </div>
          <div className="col-6">
            <h6 className="text-muted">Net Gain</h6>
            <h5
              className={`fw-bold ${
                netGain >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {netGain >= 0 ? "+" : ""}${netGain.toFixed(2)}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;
