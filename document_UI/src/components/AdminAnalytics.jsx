import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const barData = {
    labels: ['Contracts', 'Invoices', 'Receipts'],
    datasets: [
      {
        label: 'Uploaded Documents',
        data: [12, 8, 5],
        backgroundColor: ['#4ade80', '#60a5fa', '#facc15']
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  const doughnutData = {
    labels: ['Processed', 'Pending'],
    datasets: [
      {
        data: [20, 10],
        backgroundColor: ['#10b981', '#f97316'],
        borderWidth: 0
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
        }
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '10px 20px',
      gap: '2rem',
      flexWrap: 'wrap',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '450px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Document Upload Overview
        </h3>
        <Bar data={barData} options={barOptions} />
      </div>
      <div style={{ width: '300px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Processing Status
        </h3>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}