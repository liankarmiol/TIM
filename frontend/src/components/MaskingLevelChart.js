import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MaskingLevelChart = ({ logs }) => {
  const data = {
    labels: logs.map((log) => log.date), // x-axis is date
    datasets: [
      {
        label: "Masking Level", // The title for the graph line
        data: logs.map((log) => log.maskingLevel), // y-axis is masking level
        borderColor: "rgba(75,192,192,1)", // Line color
        backgroundColor: "rgba(75,192,192,0.2)", // Area fill under line
        fill: true, // Fill the area under the line
        tension: 0.1, // Smooth the line a bit
        pointRadius: 5, // Size of the points on the line
        pointBackgroundColor: "rgba(75,192,192,1)", // Color of points
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Masking Level Over Time",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Masking Level",
        },
        min: 0,
        max: 10,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MaskingLevelChart;
