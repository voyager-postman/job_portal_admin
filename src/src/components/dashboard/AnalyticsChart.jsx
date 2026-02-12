import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AnalyticsChart = () => {

    const data = {
    labels: ["June", "July", "August"],
    datasets: [
      {
        label: "Total Users",
        data: [1200, 1350, 1500],
        backgroundColor: "#42a5f5",
      },
      {
        label: "Total Recruiters",
        data: [230, 250, 270],
        backgroundColor: "#66bb6a",
      },
    ],
  };

   const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: "User & Recruiter Analytics (2025)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div>
       <Bar data={data} options={options} />
    </div>
  )
}

export default AnalyticsChart
