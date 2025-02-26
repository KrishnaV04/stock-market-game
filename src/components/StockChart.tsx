import ReactApexChart from "react-apexcharts";
import { StockData } from "./types";

const StockChart = ({
  startIndex,
  endIndex,
  allData,
}: {
  startIndex: number;
  endIndex: number;
  allData: StockData[];
}) => {
  if (allData.length === 0) {
    return <></>;
  }
  const candleChart: {
    series: { data: { x: Date; y: number[] }[] }[];
    options: ApexCharts.ApexOptions;
  } = {
    series: [
      {
        data: allData.slice(startIndex, endIndex),
      },
    ],
    options: {
      // title: {
      //   text: "AAPL Stock",
      //   align: "center",
      // },
      xaxis: {
        type: "category",
        labels: {
          rotate: -45,
          rotateAlways: true,
          formatter: (value: string) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={candleChart.options}
        series={candleChart.series}
        type="candlestick"
        height={"500px"}
        width={"1000px"}
      />
    </div>
  );
};

export default StockChart;
