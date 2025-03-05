import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#2c3e50', '#3498db', '#e74c3c', '#f1c40f', '#1abc9c'];

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

  // Use the fetched data as cleanedData
  const cleanedData = useMemo(() => sheetData, [sheetData]);

  // Compute areaData: group records by "Area"
  const areaData = useMemo(() => {
    const areaGroups = {};
    cleanedData.forEach(item => {
      if (!areaGroups[item.Area]) {
        areaGroups[item.Area] = { area: item.Area, baselineTotal: 0, scoreTotal: 0, count: 0 };
      }
      areaGroups[item.Area].baselineTotal += item['Baseline Score'];
      areaGroups[item.Area].scoreTotal += item.Score;
      areaGroups[item.Area].count += 1;
    });
    return Object.values(areaGroups).map(group => ({
      name: group.area,
      baseline: group.baselineTotal,
      score: group.scoreTotal,
      baselineAvg: (group.baselineTotal / group.count).toFixed(2),
      scoreAvg: (group.scoreTotal / group.count).toFixed(2),
      diff: group.scoreTotal - group.baselineTotal
    }));
  }, [cleanedData]);

  // Compute overall baseline and overall score
  const overallBaseline = useMemo(() => {
    return cleanedData.reduce((sum, item) => sum + item['Baseline Score'], 0);
  }, [cleanedData]);

  const overallScore = useMemo(() => {
    return cleanedData.reduce((sum, item) => sum + item.Score, 0);
  }, [cleanedData]);

  // Compute changed indicators (where Score != Baseline Score)
  const changedIndicators = useMemo(() => {
    return cleanedData.filter(item => item.Score !== item['Baseline Score'])
      .map(item => ({
        name: item.Indicator + (item['Sub Indicator'] !== '—' ? ` (${item['Sub Indicator']})` : ''),
        baseline: item['Baseline Score'],
        score: item.Score,
        diff: item.Score - item['Baseline Score'],
        area: item.Area
      }))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [cleanedData]);

  // Compute trend data: group by Date and sum the Score and Baseline Score per day
  const trendData = useMemo(() => {
    const groupedByDate = {};
    cleanedData.forEach(item => {
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
  }, [cleanedData]);

  // --- Rendering Functions ---

  const renderOverallSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">总基准分</h2>
        <p className="text-3xl font-bold text-gray-800">{overallBaseline}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">总得分</h2>
        <p className="text-3xl font-bold text-gray-800">{overallScore}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">增长</h2>
        <p className={`text-3xl font-bold ${overallScore > overallBaseline ? 'text-green-600' : overallScore < overallBaseline ? 'text-red-600' : 'text-gray-600'}`}>
          {overallScore - overallBaseline > 0 ? '+' : ''}{overallScore - overallBaseline}
        </p>
      </div>
    </div>
  );

  const renderAreaComparison = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center">各区域得分对比</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={areaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" name="基准分" fill="#2c3e50" />
            <Bar dataKey="score" name="当前分数" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAreaDistribution = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">基准分分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={areaData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#2c3e50"
                dataKey="baseline"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {areaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} (${((value / overallBaseline) * 100).toFixed(1)}%)`, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">当前分数分布</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={areaData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#3498db"
                dataKey="score"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {areaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} (${((value / overallScore) * 100).toFixed(1)}%)`, props.payload.name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderChangedIndicators = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center">显著变化的指标</h2>
        {changedIndicators.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(300, changedIndicators.length * 40)}>
            <BarChart data={changedIndicators} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" name="基准分" fill="#2c3e50" />
              <Bar dataKey="score" name="当前分数" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">没有发现显著变化的指标</p>
        )}
      </div>
    </div>
  );

  const renderAreaDetailsTable = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center">区域详情</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-left">区域</th>
                <th className="py-2 px-4 border text-right">基准分</th>
                <th className="py-2 px-4 border text-right">当前分数</th>
                <th className="py-2 px-4 border text-right">变化</th>
                <th className="py-2 px-4 border text-right">基准平均分</th>
                <th className="py-2 px-4 border text-right">当前平均分</th>
              </tr>
            </thead>
            <tbody>
              {areaData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border text-right">{item.baseline}</td>
                  <td className="py-2 px-4 border text-right">{item.score}</td>
                  <td className={`py-2 px-4 border text-right ${item.diff > 0 ? 'text-green-600' : item.diff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {item.diff > 0 ? '+' : ''}{item.diff}
                  </td>
                  <td className="py-2 px-4 border text-right">{item.baselineAvg}</td>
                  <td className="py-2 px-4 border text-right">{item.scoreAvg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render the trend chart showing aggregated Score and Baseline Score over time
  const renderTrendChart = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center">趋势图（按日期）</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalScore" stroke="#3498db" name="总得分" />
            <Line type="monotone" dataKey="totalBaseline" stroke="#2ecc71" name="总基准分" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">成长评估仪表板</h1>
        {renderOverallSummary()}
        {renderAreaComparison()}
        {renderAreaDistribution()}
        {renderChangedIndicators()}
        {renderAreaDetailsTable()}
        {renderTrendChart()}
      </div>
    </div>
  );
};

export default Dashboard;
