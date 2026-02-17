

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
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Cancelled Orders</h2>
            
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
    <p><strong>Cancelled On:</strong> {moment(order.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
    <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
</div>

                            <div className="w-full md:w-1/2 flex items-center justify-end md:justify-end mt-4 md:mt-0 space-x-4">
                                <div className="flex flex-col items-end">
                                    <p className="font-semibold">Original Product:</p>
                                    {order.orderItems?.[0]?.product?.images?.[0] ? (
                                        <img
                                            src={order.orderItems[0].product.images[0]}
                                            alt="Original Product"
                                            className="w-24 h-24 object-cover rounded mt-2"
                                        />
                                    ) : (
                                        <p className="text-gray-500 text-sm mt-2">Image not available</p>
                                    )}
                                </div>
                                <button onClick={() => handleRevertStatus(order._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 self-start md:self-auto">Revert</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No cancelled orders found for this period.</p>
                )}
            </div>
        </div>
    );
};

export default CancelledOrders;