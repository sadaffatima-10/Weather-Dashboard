import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registering the components and scales from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherChart = ({ historicalData }) => {
  // Check if historicalData exists and has data points
  if (!historicalData || historicalData.length === 0) {
    return <div>No data to display chart.</div>;
  }

  // Prepare the data for the chart
  const data = {
    labels: historicalData.map(item => item.date), // The dates for the x-axis
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.map(item => item.temp), // The temperatures for the y-axis
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Wind Speed (m/s)',
        data: historicalData.map(item => item.wind), // The wind speeds for the y-axis
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Define the chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weather Data for the Last 7 Days',
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '20px auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;