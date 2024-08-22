import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './graphics.css';

// Datos de ejemplo
const data = [
  { name: 'Day 1', value: 850 },
  { name: 'Day 2', value: 900 },
  { name: 'Day 3', value: 920 },
  { name: 'Day 4', value: 1000 },
  { name: 'Day 5', value: 1150 },
  { name: 'Day 6', value: 1400 },
  { name: 'Day 7', value: 1200 }
];

const PerformanceCard = ({ title, value }) => {
  return (
    <div className="card">
      <h3 className="stat-number">{value}</h3>
      <p className="stat-title">{title}</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceCard;
