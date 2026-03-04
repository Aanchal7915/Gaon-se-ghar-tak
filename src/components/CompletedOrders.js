import React, { useState, useEffect } from 'react';

import moment from 'moment';
import apiClient from '../services/apiClient';

const CompletedOrders = ({ refreshFlag }) => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    const fetchCompletedOrders = async () => {
        console.log('Attempting to fetch completed orders...');
        setLoading(true);
        try {
            const url = `/orders/completed?month=${selectedMonth}&year=${selectedYear}`;
            console.log('Fetching from URL:', url);

            const response = await apiClient.get(url);

            console.log('API call successful. Data received:', response.data);
            setCompletedOrders(response.data);
        } catch (err) {
            console.error(
                'Failed to fetch completed orders. Error:',
                err.response?.data?.message || err.message
            );
            setError('Failed to fetch completed orders.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log('useEffect triggered. Refresh flag:', refreshFlag);
        fetchCompletedOrders();
    }, [selectedMonth, selectedYear, refreshFlag]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = completedOrders.filter(order =>
            order.user?.name.toLowerCase().includes(lowercasedSearchTerm) ||
            order.user?.email.toLowerCase().includes(lowercasedSearchTerm) ||
            order.user?.phone?.toLowerCase().includes(lowercasedSearchTerm) ||
            order.orderNumber.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredOrders(results);
    }, [searchTerm, completedOrders]);

    const months = moment.months().map((name, index) => ({ name, value: index + 1 }));
    const years = [2024, 2025, 2026];

    const handleRevertStatus = async (orderId) => {
        const confirmRevert = window.confirm('Are you sure you want to revert this order? It will be moved back to the Unassigned list.');
        if (!confirmRevert) return;

        console.log('Reverting status for order:', orderId);
        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/orders/revert-status',
                { orderId, status: 'pending' },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Order status reverted successfully!');
            fetchCompletedOrders();
        } catch (err) {
            console.error('Failed to revert status. Error:', err.response?.data?.message || err.message);
            alert('Failed to revert status.');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading completed orders...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Completed Orders</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, order ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-3 flex-grow">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Delivered</span>
                                        <p className="text-sm font-black text-gray-900 tracking-tight">#{order.orderNumber}</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer Info</p>
                                            <p className="text-[10px] font-black text-gray-900 leading-tight">{order.user?.name}</p>
                                            <p className="text-[10px] font-bold text-gray-500">{order.user?.phone || 'No Phone'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Shipping Address</p>
                                            <p className="text-[10px] font-bold text-gray-600 line-clamp-2">{order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Delivered By</p>
                                            <p className="text-[10px] font-black text-blue-600">{order.assignedTo?.name || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Completion Date</p>
                                            <p className="text-[10px] font-bold text-gray-600">{moment(order.deliveredAt).format('MMM Do YYYY, h:mm A')}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm">
                                            ₹{order.totalPrice}
                                        </div>
                                        <button
                                            onClick={() => handleRevertStatus(order._id)}
                                            className="px-4 py-1.5 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                        >
                                            Revert
                                        </button>
                                    </div>
                                </div>

                                <div className="md:w-48 shrink-0">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Order Items</p>
                                    <div className="space-y-2">
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="flex items-center gap-3">
                                                <img
                                                    src={item.product?.images?.[0]}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black text-gray-900 truncate leading-tight uppercase">{item.name}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Size: {item.size} • Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
                        No completed orders found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedOrders;