// src/components/DeliveredOrdersAnalytics.js
import React, { useState, useEffect } from 'react';

import apiClient from '../services/apiClient';
import moment from 'moment';

const DeliveredOrdersAnalytics = () => {
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [todayDeliveredCount, setTodayDeliveredCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [selectedYear, setSelectedYear] = useState(moment().year());

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
        const [monthlyRes, todayRes] = await Promise.all([
            apiClient.get(`/delivery/delivered-orders?month=${selectedMonth}&year=${selectedYear}`),
            apiClient.get(
                `/delivery/delivered-orders?day=${moment().date()}&month=${moment().month() + 1}&year=${moment().year()}`
            )
        ]);

        setDeliveredOrders(monthlyRes.data);
        setTodayDeliveredCount(todayRes.data.length);
    } catch (err) {
        setError('Failed to fetch delivered orders.');
        console.error(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchDeliveredOrders();
    }, [selectedMonth, selectedYear]);

    const months = moment.months().map((name, index) => ({ name, value: index + 1 }));
    const years = [2024, 2025, 2026];

    if (loading) return <div className="text-center mt-10">Loading delivered orders...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Delivered Orders Analytics</h2>
            
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                    <div className="text-xl font-bold">Today's Delivered: {todayDeliveredCount}</div>
                    <div className="text-xl font-bold">This Month: {deliveredOrders.length}</div>
                </div>
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
            
            <div className="space-y-4">
                {deliveredOrders.length > 0 ? (
                    deliveredOrders.map(delivery => (
                        <div key={delivery._id} className="bg-gray-100 rounded-lg p-4">
                            <p><strong>Order ID:</strong> {delivery.order._id}</p>
                            <p><strong>Customer Name:</strong> {delivery.order.user?.name}</p>
                            <p><strong>Email:</strong> {delivery.order.user?.email}</p>
                            <p><strong>Phone:</strong> {delivery.order.user?.phone}</p>
                            <p><strong>Delivered On:</strong> {moment(delivery.deliveredAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                        </div>
                    ))
                ) : (
                    <p>No orders delivered this month.</p>
                )}
            </div>
        </div>
    );
};

export default DeliveredOrdersAnalytics;