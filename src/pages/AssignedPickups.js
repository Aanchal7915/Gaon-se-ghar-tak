import React, { useState, useEffect } from 'react';

import apiClient from '../services/apiClient';
import moment from 'moment';

const AssignedPickups = () => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   const fetchAssignedPickups = async () => {
    setLoading(true);
    try {
        const response = await apiClient.get('/return-replace/admin/assigned-pickups');
        setPickups(response.data);
    } catch (err) {
        setError('Failed to fetch assigned pickups.');
        console.error(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        fetchAssignedPickups();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading assigned pickups...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Assigned Return & Replacement Pickups</h2>
            <div className="space-y-4">
                {pickups.length > 0 ? (
                    pickups.map(pickup => (
                        <div key={pickup._id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold">Request ID: {pickup._id}</h3>
                            <p className="mt-2"><strong>Order ID:</strong> {pickup.order?.orderNumber}</p>
                            <div className="flex items-start space-x-4 my-2">
                                <img
                                    src={pickup.order?.orderItems?.[0]?.product?.images?.[0]}
                                    alt="Product"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <p><strong>Product:</strong> {pickup.order?.orderItems?.[0]?.product?.name}</p>
                                    <p><strong>Request Type:</strong> <span className="capitalize">{pickup.type}</span></p>
                                    <p><strong>Status:</strong> <span className="capitalize text-blue-600 font-bold">{pickup.status}</span></p>
                                </div>
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <p><strong>Customer:</strong> {pickup.user?.name}</p>
                                <p><strong>Email:</strong> {pickup.user?.email}</p>
                                <p><strong>Phone:</strong> {pickup.user?.phone}</p>
                                <p><strong>Pickup Address:</strong> {pickup.order?.shippingAddress?.address}, {pickup.order?.shippingAddress?.city}, {pickup.order?.shippingAddress?.postalCode}</p>

                                <p><strong>Assigned to:</strong> {pickup.pickupPerson?.name} ({pickup.pickupPerson?.email})</p>
                                <p><strong>Assigned On:</strong> {moment(pickup.updatedAt).format('MMMM Do YYYY, h:mm a')}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No assigned pickups found.</p>
                )}
            </div>
        </div>
    );
};

export default AssignedPickups;