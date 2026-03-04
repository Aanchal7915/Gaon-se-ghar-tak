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
            (request.user?.name || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (request.order?.orderNumber || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (request.user?.phone || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (request.order?.shippingAddress?.address || '').toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredRequests(results);
    }, [searchTerm, requests]);

    const formatStatus = (status) => {
        if (status === 'received' || status === 'completed') {
            return 'Return Completed';
        }
        return status;
    };

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading {type} requests...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight capitalize">{type} Requests</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Year"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-20 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="flex-grow md:flex-none bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        <option value="">MONTH...</option>
                        {moment.months().map((month, index) => (
                            <option key={index} value={index + 1}>{month.toUpperCase()}</option>
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
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(request => (
                        <div key={request._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-6 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Request ID: {request._id.slice(-8)}</p>
                                    <p className="text-sm font-black text-gray-900 tracking-tight">#{request.order?.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${request.status === 'completed' || request.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {formatStatus(request.status)}
                                    </span>
                                    <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{moment(request.updatedAt).format('MMM Do YYYY, h:mm A')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Customer Info</p>
                                        <p className="text-[10px] font-black text-gray-900">{request.user?.name}</p>
                                        <p className="text-[10px] font-bold text-gray-500">{request.user?.phone || 'No Phone'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 lowercase">{request.user?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Address</p>
                                        <p className="text-[10px] font-bold text-gray-600 leading-tight">{request.order?.shippingAddress?.address}, {request.order?.shippingAddress?.city}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none border-b border-gray-50 pb-1">Requested Item ({request.type})</p>
                                    <div className="flex items-center gap-3">
                                        {request.originalItem?.product?.images?.[0] ? (
                                            <img
                                                src={request.originalItem.product.images[0]}
                                                alt={request.originalItem.name}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-50"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[6px] font-black text-gray-300">NO IMG</div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{request.originalItem?.name || 'Unknown'}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Size: {request.originalItem?.size} • Qty: {request.originalItem?.qty}</p>
                                            <p className="text-[10px] font-black text-blue-600 mt-0.5">₹{request.originalItem?.price}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-gray-50">
                                        <p className="text-[9px] font-bold text-gray-600 leading-tight"><span className="text-gray-400 font-black uppercase tracking-widest text-[7px] mr-1">Reason:</span> {request.reason}</p>
                                        {request.rejectionReason && (
                                            <p className="text-[9px] font-bold text-red-500 leading-tight bg-red-50 p-2 rounded-lg border border-red-100">
                                                <span className="text-red-700 font-black uppercase tracking-widest text-[7px] mr-1">Rejection:</span> {request.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
                        No {type} requests found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedCancelledRequests;