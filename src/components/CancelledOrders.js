

import React, { useState, useEffect } from 'react';

import apiClient from '../services/apiClient';
import moment from 'moment';

const CancelledOrders = ({ refreshFlag }) => {
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    const fetchCancelledOrders = async () => {
        try {
            const response = await apiClient.get(
                `/orders/cancelled?month=${selectedMonth}&year=${selectedYear}`
            );
            setCancelledOrders(response.data);
        } catch (err) {
            setError('Failed to fetch cancelled orders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCancelledOrders();
    }, [selectedMonth, selectedYear, refreshFlag]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = cancelledOrders.filter(order =>
            order.user?.name.toLowerCase().includes(lowercasedSearchTerm) ||
            order.user?.email.toLowerCase().includes(lowercasedSearchTerm) ||
            order.user?.phone?.toLowerCase().includes(lowercasedSearchTerm) ||
            order.orderNumber.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredOrders(results);
    }, [searchTerm, cancelledOrders]);

    const months = moment.months().map((name, index) => ({ name, value: index + 1 }));
    const years = [2024, 2025, 2026];

    const handleRevertStatus = async (orderId) => {
        const confirmRevert = window.confirm('Are you sure you want to revert this order? It will be moved back to the Unassigned list.');
        if (!confirmRevert) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/orders/revert-status',
                { orderId, status: 'pending' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Order status reverted successfully!');
            fetchCancelledOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to revert status.');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading cancelled orders...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Cancelled Orders</h2>

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
                        <div key={order._id} className="bg-red-50/30 border border-red-100/50 rounded-2xl p-4 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-3 flex-grow">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-red-100 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Cancelled</span>
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
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Original Assignee</p>
                                            <p className="text-[10px] font-black text-blue-600">{order.assignedTo?.name || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Cancelled Date</p>
                                            <p className="text-[10px] font-bold text-gray-600">{moment(order.updatedAt).format('MMM Do YYYY, h:mm A')}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase shadow-sm">
                                            ₹{order.totalPrice}
                                        </div>
                                        <button
                                            onClick={() => handleRevertStatus(order._id)}
                                            className="px-4 py-1.5 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                        >
                                            Revert
                                        </button>
                                    </div>
                                </div>

                                <div className="md:w-32 shrink-0 flex flex-col items-center md:items-end">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1 w-full text-right">Preview</p>
                                    {order.orderItems?.[0]?.product?.images?.[0] ? (
                                        <img
                                            src={order.orderItems[0].product.images[0]}
                                            alt=""
                                            className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-[8px] font-black text-gray-300 uppercase tracking-tighter text-center px-2">No Image</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
                        No cancelled orders found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelledOrders;