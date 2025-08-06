// src/components/AdminCharts.jsx
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminCharts = () => {
  const barData = {
    labels: ['Contracts', 'Invoices', 'Receipts'],
    datasets: [
      {
        label: 'Documents',
        data: [12, 8, 5], // dummy data (replace with backend data later)
        backgroundColor: ['#00d084', '#40a9ff', '#ffce56'],
      },
    ],
  };

  const doughnutData = {
    labels: ['Processed', 'Pending'],
    datasets: [
      {
        label: 'Status',
        data: [22, 10], // dummy data (replace with backend later)
        backgroundColor: ['#3c7761ff', '#ac4b59ff'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
      <div style={{ width: '45%', backgroundColor: '#2e2e2e', padding: '1rem', borderRadius: '8px' }}>
        <Bar data={barData} options={{ plugins: { legend: { display: false } }, responsive: true }} />
      </div>
      <div style={{ width: '30%', backgroundColor: '#2e2e2e', padding: '1rem', borderRadius: '8px' }}>
        <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'top' } }, responsive: true }} />
      </div>
    </div>
  );
};

export default AdminCharts;
