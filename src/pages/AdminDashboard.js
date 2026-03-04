

import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

import ProductManagement from '../components/ProductManagement';
import UserManagement from '../components/UserManagement';
import CreateUser from '../components/CreateUser';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import CompletedOrders from '../components/CompletedOrders';
import CancelledOrders from '../components/CancelledOrders';
import ReturnReplaceRequests from '../components/ReturnReplaceRequests';
import CompletedCancelledRequests from '../components/CompletedCancelledRequests';
import AssignedPickups from './AssignedPickups';
import AppointmentManagement from '../components/AppointmentManagement';
import FranchiseStockManagement from '../components/FranchiseStockManagement';
import { HiMenu, HiX } from 'react-icons/hi';


const AdminDashboard = () => {
    const [unassignedOrders, setUnassignedOrders] = useState([]);
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('unassignedOrders');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [orderToAssign, setOrderToAssign] = useState(null);
    const [selectedPartner, setSelectedPartner] = useState('');
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUnassigned, setFilteredUnassigned] = useState([]);
    const [filteredAssigned, setFilteredAssigned] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [unassignedRes, partnersRes, assignedRes] = await Promise.all([
                apiClient.get('/orders/unassigned'),
                apiClient.get('/users/delivery-partners'),
                apiClient.get('/orders/assigned'),
            ]);

            setUnassignedOrders(unassignedRes.data);
            setDeliveryPartners(partnersRes.data);
            setAssignedOrders(assignedRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAllData();
    }, [refreshFlag]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();

        // Filter unassigned orders

        const unassignedResults = unassignedOrders.filter(order =>
            (order.customerInfo?.name || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.customerInfo?.phone || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.user?.email || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.orderNumber || '').toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredUnassigned(unassignedResults);

        // Filter assigned orders
        const assignedResults = assignedOrders.filter(order =>
            (order.customerInfo?.name || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.customerInfo?.phone || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.user?.email || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.assignedTo?.name || '').toLowerCase().includes(lowercasedSearchTerm) ||
            (order.orderNumber || '').toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredAssigned(assignedResults);
    }, [searchTerm, unassignedOrders, assignedOrders]);

    const handleAssignClick = (order) => {
        setOrderToAssign(order);
        setShowAssignModal(true);
    };

    const handleAssignOrder = async () => {
        if (!selectedPartner) {
            alert('Please select a delivery partner.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                '/delivery/assign',
                { orderId: orderToAssign._id, deliveryPersonId: selectedPartner },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Order assigned successfully!');
            setShowAssignModal(false);
            setOrderToAssign(null);
            setSelectedPartner('');
            setRefreshFlag(prev => !prev);
        } catch (err) {
            setError('Failed to assign order.');
            console.error(err);
        }
    };

    const handleAdminStatusChange = async (orderId, status) => {
        const confirmChange = window.confirm(`Are you sure you want to change the status to '${status}'?`);
        if (!confirmChange) return;

        try {
            const token = localStorage.getItem('token');
            await apiClient.post(
                `/delivery/admin/update-status/${orderId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Status updated successfully!');
            setRefreshFlag(prev => !prev);
        } catch (err) {
            setError('Failed to update status.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading admin dashboard...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 focus:outline-none"
                >
                    {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 overflow-y-auto animate-slide-left" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <HiX size={20} />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2">
                            {[
                                { id: 'unassignedOrders', label: 'Unassigned' },
                                { id: 'assignedOrders', label: 'Assigned' },
                                { id: 'products', label: 'Products' },
                                { id: 'users', label: 'Users' },
                                { id: 'createUser', label: 'Create User' },
                                { id: 'analytics', label: 'Analytics' },
                                { id: 'completedOrders', label: 'Completed' },
                                { id: 'cancelledOrders', label: 'Cancelled' },
                                { id: 'pendingReturns', label: 'Returns' },
                                { id: 'assignedPickups', label: 'Pickups' },
                                { id: 'completedReturns', label: 'Done Returns' },
                                { id: 'cancelledReturns', label: 'No Returns' },
                                { id: 'appointments', label: 'Appointments' },
                                { id: 'franchise', label: 'Franchise' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:block mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar scrollbar-hide">
                <nav className="flex items-center gap-1 min-w-max">
                    {[
                        { id: 'unassignedOrders', label: 'Unassigned' },
                        { id: 'assignedOrders', label: 'Assigned' },
                        { id: 'products', label: 'Products' },
                        { id: 'users', label: 'Users' },
                        { id: 'createUser', label: 'Create' },
                        { id: 'analytics', label: 'Analytics' },
                        { id: 'completedOrders', label: 'Completed' },
                        { id: 'cancelledOrders', label: 'Cancelled' },
                        { id: 'pendingReturns', label: 'Returns' },
                        { id: 'assignedPickups', label: 'Pickups' },
                        { id: 'completedReturns', label: 'Done Returns' },
                        { id: 'cancelledReturns', label: 'No Returns' },
                        { id: 'appointments', label: 'Appointments' },
                        { id: 'franchise', label: 'Franchise' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'unassignedOrders' && (
                <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Unassigned Deliveries</h2>
                        <div className="relative w-full md:w-auto">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name, phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredUnassigned.length > 0 ? filteredUnassigned.map(order => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all">
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">{order.orderNumber}</span>
                                        <span className="text-[10px] font-black bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Unassigned</span>
                                    </div>
                                    <p className="text-[11px] md:text-sm font-black text-gray-900">{order.customerInfo?.name}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 flex items-center gap-2">📞 {order.customerInfo?.phone || 'N/A'}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 flex items-center gap-2">📍 {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                    <p className="text-xs md:text-sm font-black text-green-600 mt-2">₹{order.totalPrice}</p>
                                </div>
                                <div className="flex flex-col md:items-end gap-4 shrink-0">
                                    <div className="space-y-2">
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="flex items-center gap-3 bg-gray-50 p-1.5 md:p-2 rounded-xl border border-gray-100/50">
                                                <img
                                                    src={item.product?.images?.[0]}
                                                    alt={item.name}
                                                    className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="text-[9px] md:text-[10px] font-black text-gray-900 leading-tight">{item.name}</p>
                                                    <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase">Pack: {item.size}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleAssignClick(order)}
                                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all uppercase"
                                    >
                                        Assign Agent
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold text-sm">No unassigned orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'assignedOrders' && (
                <div className="animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">Assigned Deliveries</h2>
                        <div className="relative w-full md:w-auto">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name, agent..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredAssigned.length > 0 ? filteredAssigned.map(order => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all">
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">{order.orderNumber}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] md:text-sm font-black text-gray-900">{order.customerInfo?.name}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 flex items-center gap-2">📞 {order.customerInfo?.phone || 'N/A'}</p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 flex items-center gap-2">👤 Agent: <span className="text-blue-600">{order.assignedTo?.name}</span></p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4">PRODUCTS</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.orderItems.map((item) => (
                                            <div key={item._id} className="flex items-center gap-2 bg-gray-50 p-1 md:p-1.5 rounded-lg border border-gray-100">
                                                <img src={item.product?.images?.[0]} className="w-5 h-5 md:w-6 md:h-6 object-cover rounded" alt="" />
                                                <span className="text-[8px] md:text-[9px] font-black text-gray-600">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end justify-between gap-4">
                                    <p className="text-base md:text-lg font-black text-gray-900">₹{order.totalPrice}</p>
                                    <div className="grid grid-cols-2 lg:flex gap-2 w-full md:w-auto">
                                        <button onClick={() => handleAdminStatusChange(order._id, 'delivered')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all">COMPLETE</button>
                                        <button onClick={() => handleAdminStatusChange(order._id, 'cancelled')} className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all">CANCEL</button>
                                        <button onClick={() => handleAssignClick(order)} className="col-span-2 md:col-auto bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all uppercase">Reassign</button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold text-sm">No assigned orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'pendingReturns' && <ReturnReplaceRequests deliveryPartners={deliveryPartners} setActiveTab={setActiveTab} />}
            {activeTab === 'assignedPickups' && <AssignedPickups setActiveTab={setActiveTab} />}
            {activeTab === 'completedReturns' && <CompletedCancelledRequests type="completed" />}
            {activeTab === 'cancelledReturns' && <CompletedCancelledRequests type="cancelled" />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'users' && <UserManagement />}
            {/* {activeTab === 'users' && <UserManagement onUserListUpdated={fetchAllData} />} */}
            {activeTab === 'createUser' && <CreateUser onUserCreated={fetchAllData} />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'completedOrders' && <CompletedOrders refreshFlag={refreshFlag} />}
            {activeTab === 'cancelledOrders' && <CancelledOrders refreshFlag={refreshFlag} />}
            {activeTab === 'appointments' && <AppointmentManagement />}
            {activeTab === 'franchise' && <FranchiseStockManagement />}


            {showAssignModal && (
                <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center p-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-sm animate-pop-in">
                        <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">Assign Order</h3>
                        <p className="text-xs font-bold text-gray-500 mb-6">Assigning <span className="text-blue-600">{orderToAssign.customerInfo?.name}</span>'s order to an agent.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Select Delivery Partner</label>
                                <select
                                    onChange={(e) => setSelectedPartner(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="">Choose partner...</option>
                                    {deliveryPartners.map(partner => (
                                        <option key={partner._id} value={partner._id}>{partner.name} ({partner.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-xl text-xs font-black transition-all"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleAssignOrder}
                                    disabled={!selectedPartner}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white px-4 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;