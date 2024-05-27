
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeChart = ({ data }) => {
    const [filter, setFilter] = useState('monthly');

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredData = data.filter(item => item.filterType === filter);

    return (
        <div style={{margin:'0 auto', width:'85%'}}>
            <div style={{display:'flex', gap: '15px', alignItems:'center', justifyContent:'flex-start', width:'25%'}}>
                <button onClick={() => handleFilterChange('daily')}>Diario</button>
                <button onClick={() => handleFilterChange('weekly')}>Semanal</button>
                <button onClick={() => handleFilterChange('monthly')}>Mensual</button>
                <button onClick={() => handleFilterChange('yearly')}>Anual</button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeChart;