import React, { useState, useEffect } from 'react';

import moment from 'moment';
import apiClient from '../services/apiClient';

const CompletedCancelledRequests = ({ type }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = type === 'completed' ? 'completed' : 'cancelled';
            const response = await apiClient.get(
                `/return-replace/admin/${endpoint}?month=${filterMonth}&year=${filterYear}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequests(response.data);
            setLoading(false);
        } catch (err) {
            setError(`Failed to fetch ${type} requests.`);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRequests();
    }, [filterMonth, filterYear, type]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = requests.filter(request => 
            request.user?.name.toLowerCase().includes(lowercasedSearchTerm) ||
            request.order?.orderNumber.toLowerCase().includes(lowercasedSearchTerm) ||
            request.user?.phone?.toLowerCase().includes(lowercasedSearchTerm) ||
            request.order?.shippingAddress?.address.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredRequests(results);
    }, [searchTerm, requests]);

    const formatStatus = (status) => {
        if (status === 'received' || status === 'completed') {
            return 'Return Completed';
        }
        return status;
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 capitalize">{type} Requests</h2>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                <input
                    type="number"
                    placeholder="Year"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="p-2 border rounded"
                />
                <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="">Select Month</option>
                    {moment.months().map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search by name, order ID, or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-full sm:w-auto"
                />
            </div>
            <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(request => (
                        <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                            <p><strong>Request ID:</strong> {request._id}</p>
                            <p><strong>Order Number:</strong> {request.order?.orderNumber}</p>
                         <p><strong>Customer:</strong> {request.user?.name}</p>
<p><strong>Email:</strong> {request.user?.email}</p>
<p><strong>Phone:</strong> {request.user?.phone || 'N/A'}</p>
<p><strong>Address:</strong> {request.order?.shippingAddress?.address}, {request.order?.shippingAddress?.city}, {request.order?.shippingAddress?.postalCode}</p>

                            <p><strong>Type:</strong> <span className="capitalize">{request.type}</span></p>
                            <p><strong>Reason:</strong> {request.reason}</p>
                            <p><strong>Status:</strong> <span className="capitalize">{formatStatus(request.status)}</span></p>
                            <p><strong>Date:</strong> {moment(request.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <div className="mt-4">
                                <p><strong>Original Product:</strong></p>
                              {request.order?.orderItems?.[0]?.product?.images?.[0] ? (
    <img
        src={request.order.orderItems[0].product.images[0]}
        alt="Original Product"
        className="w-24 h-24 object-cover rounded mt-2"
    />
) : (
    <p className="text-gray-500">Image not available</p>
)}

                            </div>
                        </div>
                    ))
                ) : (
                    <p>No {type} requests found for this search/filter.</p>
                )}
            </div>
        </div>
    );
};

export default CompletedCancelledRequests;