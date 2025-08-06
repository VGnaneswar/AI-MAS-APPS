import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AnalyticsChart = () => {
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Documents Uploaded",
        data: [10, 15, 7, 20, 12],
        backgroundColor: "#4b82f6",
      },
    ],
  };

  const doughnutData = {
    labels: ["Processed", "Pending"],
    datasets: [
      {
        label: "Status",
        data: [70, 30],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ width: "300px" }}>
        <h3>Upload Activity</h3>
        <Bar data={barData} />
      </div>
      <div style={{ width: "250px" }}>
        <h3>Status Overview</h3>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default AnalyticsChart;
