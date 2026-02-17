// src/components/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import apiClient from '../services/apiClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [todayData, setTodayData] = useState({ totalOrders: 0, totalSales: 0 });
    const [dailySalesData, setDailySalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [cancelledOrders, setCancelledOrders] = useState([]);

 const fetchAnalytics = async () => {
  try {
    const [todayRes, dailyRes, cancelledRes] = await Promise.all([
      apiClient.get('/analytics/today'),
      apiClient.get(`/analytics/daily?month=${selectedMonth}&year=${selectedYear}`),
      apiClient.get('/orders/cancelled'),
    ]);
    setTodayData(todayRes.data);
    setDailySalesData(dailyRes.data);
    setCancelledOrders(cancelledRes.data);
  } catch (err) {
    setError('Failed to fetch analytics data.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


    useEffect(() => {
        fetchAnalytics();
    }, [selectedMonth, selectedYear]);

    const chartData = {
        labels: dailySalesData.map(d => `Day ${d._id.day}`),
        datasets: [{
            label: 'Daily Sales (₹)',
            data: dailySalesData.map(d => d.totalSales),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
        }],
    };

    const months = moment.months().map((name, index) => ({ name, value: index + 1 }));
    const years = [2024, 2025, 2026];

    if (loading) return <div className="text-center mt-10">Loading analytics...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700">Today's Orders</h2>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{todayData.totalOrders}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700">Today's Sales Amount</h2>
                    <p className="text-4xl font-bold text-gray-900 mt-2">₹{todayData.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700">Total Cancelled Orders</h2>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{cancelledOrders.length}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Daily Sales Overview</h2>
                    <div className="flex space-x-2">
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-2 border rounded-md">
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </select>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border rounded-md">
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Bar options={{ responsive: true }} data={chartData} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;