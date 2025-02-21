import { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { StockData } from "./types";

const StockChart = ({
  startIndex,
  turn,
  allData,
}: {
  startIndex: number;
  turn: number;
  allData: StockData[];
}) => {
  const [chartState, setChartState] = useState<{
    series: { data: { x: Date; y: number[] }[] }[];
    options: ApexCharts.ApexOptions;
  }>({
    series: [
      {
        data: allData,
      },
    ],
    options: {
      title: {
        text: "AAPL Stock",
        align: "center",
      },
      xaxis: {
        type: "category",
        labels: {
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
  });

  useEffect(() => {
    setChartState((prevState) => ({
      ...prevState,
      series: [{ data: allData }],
    }));
  }, [allData]);

  const slicedSeries = useMemo(() => {
    return [
      {
        data: chartState.series[0].data.slice(
          startIndex - 10,
          startIndex + turn + 1
        ),
      },
    ];
  }, [turn]);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartState.options}
        series={slicedSeries}
        type="candlestick"
        height={500}
        width={1000}
      />
    </div>
  );
};

export default StockChart;
