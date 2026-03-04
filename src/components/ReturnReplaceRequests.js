


import React, { useState, useEffect } from 'react';

import apiClient from '../services/apiClient';
import moment from 'moment';

const ReturnReplaceRequests = ({ deliveryPartners, setActiveTab }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [requestToAssign, setRequestToAssign] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState('');

    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/return-replace/admin/pending');
            setRequests(response.data);
        } catch (err) {
            setError('Failed to fetch requests.');
            console.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAssignPickupClick = (request) => {
        setRequestToAssign(request);
        setShowAssignModal(true);
    };

    const handleAssignPickup = async () => {
        if (!selectedPartner) {
            alert('Please select a delivery partner.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/return-replace/admin/assign-pickup',
                { requestId: requestToAssign._id, deliveryPersonId: selectedPartner },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Pickup assigned successfully!');
            setShowAssignModal(false);
            setRequestToAssign(null);
            setSelectedPartner('');
            fetchPendingRequests();
        } catch (err) {
            alert('Failed to assign pickup.');
            console.error(err);
        }
    };

    const handleApproveRequest = async (requestId) => {
        if (window.confirm('Are you sure you want to approve this request?')) {
            try {
                const token = localStorage.getItem('token');
                await apiClient.post(
                    '/return-replace/admin/approve-request',
                    { requestId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Request approved successfully!');
                fetchPendingRequests();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to approve request.');
                console.error(err);
            }
        }
    };

    const handleMoveToUnassigned = async (requestId) => {
        if (!window.confirm("Are you sure you want to move this request to unassigned deliveries?")) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/return-replace/admin/update-status',
                { requestId: requestId, status: 'received' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchPendingRequests();
            setActiveTab('unassignedOrders');
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        // Prompt the admin for a rejection reason
        const reason = window.prompt("Please provide a reason for rejecting this request:");
        if (!reason) {
            return alert('Rejection reason is required.');
        }

        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                const token = localStorage.getItem('token');
                await apiClient.post(
                    '/return-replace/admin/reject-request',
                    { requestId, reason }, // Pass the reason to the backend
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Request rejected successfully!');
                fetchPendingRequests(); // Refresh the list
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to reject request.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="text-center mt-10">Loading requests...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Return & Replacement Requests</h2>
            <div className="grid grid-cols-1 gap-4">
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${request.type === 'return' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {request.type}
                                </span>
                                <span className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                    {request.status}
                                </span>
                                <p className="text-xs font-black text-gray-900 ml-auto">#{request.order?.orderNumber}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer Details</p>
                                        <p className="text-[10px] font-black text-gray-900">{request.user?.name} <span className="text-gray-400 font-bold ml-1">({request.user?.phone})</span></p>
                                        <p className="text-[10px] font-bold text-gray-500">{request.user?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Pickup Address</p>
                                        <p className="text-[10px] font-bold text-gray-600 leading-tight">{request.order?.shippingAddress?.address}, {request.order?.shippingAddress?.city} - {request.order?.shippingAddress?.postalCode}</p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Reason</p>
                                        <p className="text-[10px] font-bold text-gray-700 bg-white p-2 rounded-lg border border-gray-100 italic">"{request.reason}"</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none border-b border-gray-100 pb-1">Product Details</p>
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                        {request.originalItem?.product?.images?.[0] ? (
                                            <img
                                                src={request.originalItem.product.images[0]}
                                                alt={request.originalItem.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-50"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-[6px] font-black text-gray-300">NO IMG</div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-gray-900 truncate tracking-tight leading-tight uppercase">{request.originalItem?.name || 'Unknown Product'}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Size: {request.originalItem?.size} • Qty: {request.originalItem?.qty}</p>
                                            <p className="text-[10px] font-black text-blue-600 mt-0.5">₹{request.originalItem?.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {request.status === 'pending' && (
                                            <button
                                                onClick={() => handleApproveRequest(request._id)}
                                                className="flex-grow bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {request.status === 'approved' && (
                                            <button
                                                onClick={() => handleAssignPickupClick(request)}
                                                className="flex-grow bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-green-600/10 hover:bg-green-700 transition-all"
                                            >
                                                Assign Partner
                                            </button>
                                        )}
                                        {(request.status === 'pending' || request.status === 'approved') && (
                                            <button
                                                onClick={() => handleRejectRequest(request._id)}
                                                className="flex-grow bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Reject
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => handleMoveToUnassigned(request._id)} className="w-full text-[8px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Move to Unassigned Orders →</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
                        No pending requests found
                    </div>
                )}
            </div>

            {/* Assign Pickup Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-2xl w-full max-w-sm animate-pop-in">
                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Assign Partner</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Request ID: {requestToAssign._id.slice(-8)}</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Request Type</p>
                                <p className="text-sm font-black text-blue-600 uppercase tracking-wider">{requestToAssign.type}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Delivery Partner</label>
                                <select
                                    onChange={(e) => setSelectedPartner(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">CHOOSE PARTNER...</option>
                                    {deliveryPartners.map(partner => (
                                        <option key={partner._id} value={partner._id}>{partner.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAssignModal(false)}
                                className="bg-gray-100 text-gray-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAssignPickup}
                                className="bg-blue-600 text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                                disabled={!selectedPartner}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default ReturnReplaceRequests;