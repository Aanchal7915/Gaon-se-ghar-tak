import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import moment from 'moment';

const AssignedPickups = ({ setActiveTab }) => {
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

    const handleMoveToUnassigned = async (pickupId) => {
        if (!window.confirm("Are you sure you want to move this to unassigned deliveries?")) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/return-replace/admin/update-status',
                { requestId: pickupId, status: 'received' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchAssignedPickups();
            setActiveTab('unassignedOrders');
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        }
    };

    const handleStatusChange = async (pickupId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this pickup as '${newStatus}'?`)) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/return-replace/admin/update-status',
                { requestId: pickupId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Status updated successfully!');
            fetchAssignedPickups();
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading assigned pickups...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Assigned Pickups</h2>
            <div className="grid grid-cols-1 gap-4">
                {pickups.length > 0 ? (
                    pickups.map(pickup => (
                        <div key={pickup._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${pickup.type === 'return' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {pickup.type}
                                </span>
                                <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    Assigned
                                </span>
                                <p className="text-xs font-black text-gray-900 ml-auto leading-none">ID: {pickup._id.slice(-6).toUpperCase()}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100">
                                        {pickup.originalItem?.product?.images?.[0] ? (
                                            <img
                                                src={pickup.originalItem.product.images[0]}
                                                alt=""
                                                className="w-14 h-14 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-[6px] font-black text-gray-300">NO IMG</div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-gray-900 truncate leading-tight uppercase mb-1">{pickup.originalItem?.name || 'Unknown Item'}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Size: {pickup.originalItem?.size} • Qty: {pickup.originalItem?.qty}</p>
                                            <p className="text-[9px] font-black text-gray-900 mt-1">Order: #{pickup.order?.orderNumber}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-50">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Move To</p>
                                            <button onClick={() => handleMoveToUnassigned(pickup._id)} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-700 transition-colors">Unassigned Orders →</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer</p>
                                        <p className="text-[10px] font-black text-gray-900 uppercase leading-tight">{pickup.user?.name}</p>
                                        <p className="text-[9px] font-bold text-gray-500">{pickup.user?.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Delivery Partner</p>
                                        <p className="text-[10px] font-black text-blue-600 uppercase leading-tight">{pickup.pickupPerson?.name}</p>
                                        <p className="text-[8px] font-bold text-gray-400 lowercase">{pickup.pickupPerson?.email}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Address</p>
                                        <p className="text-[10px] font-bold text-gray-600 leading-tight">{pickup.order?.shippingAddress?.address}, {pickup.order?.shippingAddress?.city} - {pickup.order?.shippingAddress?.postalCode}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2 pt-2 border-t border-gray-100/50">
                                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Assignment Date</p>
                                        <p className="text-[9px] font-bold text-gray-400">{moment(pickup.updatedAt).format('MMM Do YYYY, h:mm A')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
                        No assigned pickups found
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignedPickups;