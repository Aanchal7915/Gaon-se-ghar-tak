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
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Completed Orders</h2>

            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
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
                <input
                    type="text"
                    placeholder="Search by name, order ID, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded-md w-full md:w-1/2"
                />
            </div>

            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order._id} className="bg-gray-100 rounded-lg p-4 flex justify-between items-start md:items-center flex-col md:flex-row">
                            <div className="w-full md:w-1/2">
                                <p><strong>Order ID:</strong> {order.orderNumber}</p>
                                <p><strong>Customer:</strong> {order.user?.name}</p>
                                <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
                                <p><strong>Email:</strong> {order.user?.email}</p>
                                <p><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                <p><strong>Assigned To:</strong> {order.assignedTo?.name || 'N/A'}</p>
                                <p><strong>Delivered On:</strong> {moment(order.deliveredAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                            </div>

                            <div className="w-full md:w-1/2 flex items-center justify-end md:justify-end mt-4 md:mt-0 space-x-4">
                                <div className="flex flex-col items-end">
                                    <p className="font-semibold">Products:</p>
                                    <div className="space-y-2 mt-2">
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="flex items-center space-x-2">
                                                <img
                                                    src={item.product?.images?.[0]}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <p className="text-sm">
                                                    {item.name} (Pack: {item.size})
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => handleRevertStatus(order._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 self-start md:self-auto">Revert</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No completed orders found for this period.</p>
                )}
            </div>
        </div>
    );
};

export default CompletedOrders;