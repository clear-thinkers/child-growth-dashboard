import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [sheetData, setSheetData] = useState([]);

  // Fetch data from the published Google Sheet CSV URL
  useEffect(() => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR1UX3_ykPcG38Tx-eK81pBvJ7QlYWOqsh1RU0_s8n3ktOXMlnnblppDDtoGIw9_Qxz8rcGlqw1ns43/pub?gid=554089839&single=true&output=csv';
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data.map(item => ({
          ...item,
          'Baseline Score': parseFloat(item['Baseline Score']) || 0,
          Score: parseFloat(item.Score) || 0,
          Date: item.Date
        }));
        setSheetData(parsedData);
      },
      error: (err) => {
        console.error('Error fetching CSV:', err);
      }
    });
  }, []);

  // Compute trend data: group by Date and sum the Score and Baseline Score per day
  const trendData = useMemo(() => {
    const groupedByDate = {};
    sheetData.forEach(item => {
      if (item.Date) {
        const dateKey = item.Date;
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = { date: dateKey, totalScore: 0, totalBaseline: 0 };
        }
        groupedByDate[dateKey].totalScore += item.Score;
        groupedByDate[dateKey].totalBaseline += item['Baseline Score'];
      }
    });
    return Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sheetData]);

  // Render the trend chart showing aggregated Score and Baseline Score over time
  const renderTrendChart = () => (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-semibold mb-4 text-custom-navy">成长趋势图</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={trendData} 
          margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#20283E" />
          <XAxis dataKey="date" stroke="#20283E" />
          <YAxis stroke="#20283E" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#DBAE58', 
              color: '#20283E',
              borderRadius: '8px'
            }} 
          />
          <Legend 
            wrapperStyle={{ 
              color: '#20283E',
              paddingTop: '10px'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="totalScore" 
            stroke="#AC3E31" 
            name="总得分" 
            strokeWidth={3}
          />
          <Line 
            type="monotone" 
            dataKey="totalBaseline" 
            stroke="#488A99" 
            name="总基准分" 
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-6 mx-20">
      <div className="w-full max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8 text-custom-navy">成长评估趋势</h1>
        {renderTrendChart()}
      </div>
    </div>
  );
};

export default Dashboard;