import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { FaEnvelope } from 'react-icons/fa';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filters, setFilters] = useState({
        year: '',
        month: '',
        search: ''
    });

    const fetchAppointments = async () => {
        try {
            const response = await apiClient.get('/appointments');
            setAppointments(response.data);
            setFilteredAppointments(response.data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        let result = [...appointments];

        if (filters.year) {
            result = result.filter(app => new Date(app.preferredDate).getFullYear().toString() === filters.year);
        }

        if (filters.month) {
            result = result.filter(app => (new Date(app.preferredDate).getMonth() + 1).toString() === filters.month);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(app =>
                app.name.toLowerCase().includes(searchLower) ||
                app.phone.includes(filters.search) ||
                (app.email && app.email.toLowerCase().includes(searchLower)) ||
                app._id.toLowerCase().includes(searchLower)
            );
        }

        setFilteredAppointments(result);
    }, [filters, appointments]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiClient.put(`/appointments/${id}/status`, { status: newStatus });
            // Update local state
            setAppointments(appointments.map(app =>
                app._id === id ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const showMessage = (msg) => {
        if (msg) setSelectedMessage(msg);
    };

    if (loading) return <div>Loading appointments...</div>;

    return (
        <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">Farm Appointments</h2>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
                <div className="flex gap-2 shrink-0">
                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="w-20 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <select
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                        className="flex-grow md:w-32 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                    >
                        <option value="">MONTH...</option>
                        <option value="1">JANUARY</option>
                        <option value="2">FEBRUARY</option>
                        <option value="3">MARCH</option>
                        <option value="4">APRIL</option>
                        <option value="5">MAY</option>
                        <option value="6">JUNE</option>
                        <option value="7">JULY</option>
                        <option value="8">AUGUST</option>
                        <option value="9">SEPTEMBER</option>
                        <option value="10">OCTOBER</option>
                        <option value="11">NOVEMBER</option>
                        <option value="12">DECEMBER</option>
                    </select>
                </div>
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by name, ID, or phone..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    />
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{appointment.name}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{appointment.phone}</p>
                                </div>
                                <select
                                    value={appointment.status || 'pending'}
                                    onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                                    className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all outline-none ${appointment.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                            appointment.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                appointment.status === 'visited' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-gray-100 text-gray-500 border-gray-200'
                                        }`}
                                >
                                    <option value="pending">PENDING</option>
                                    <option value="confirmed">CONFIRMED</option>
                                    <option value="rejected">REJECTED</option>
                                    <option value="visited">VISITED</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Date & Time</p>
                                    <p className="text-[9px] font-bold text-gray-600 uppercase">{new Date(appointment.preferredDate).toLocaleDateString()} @ {appointment.preferredTime}</p>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={() => showMessage(appointment.message)}
                                        className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-[8px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        <FaEnvelope size={10} /> Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-[10px] uppercase tracking-widest">
                        No appointments found
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto no-scrollbar">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitor</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacts</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-4 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-4 py-4 text-[10px] font-bold text-gray-900 uppercase">
                                        {new Date(appointment.preferredDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-[10px] font-bold text-gray-500 uppercase">
                                        {appointment.preferredTime}
                                    </td>
                                    <td className="px-4 py-4 text-[10px] font-black text-gray-900 uppercase">
                                        {appointment.name}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-[10px] font-bold text-gray-500">{appointment.phone}</p>
                                        <p className="text-[9px] font-medium text-gray-400 lowercase">{appointment.email || 'no email'}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={appointment.status || 'pending'}
                                            onChange={(e) => handleStatusUpdate(appointment._id, e.target.value)}
                                            className="bg-white border border-gray-100 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/10"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="visited">Visited</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button
                                            onClick={() => showMessage(appointment.message)}
                                            className="text-gray-300 hover:text-blue-500 transition-colors p-2"
                                        >
                                            <FaEnvelope size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-gray-300 font-black text-[10px] uppercase tracking-widest italic">
                                    No records found for the selected period
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Message Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-2xl w-full max-w-sm animate-pop-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <FaEnvelope size={20} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Visitor Message</h3>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                            <p className="text-xs font-bold text-gray-600 leading-relaxed italic">"{selectedMessage}"</p>
                        </div>

                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="w-full bg-gray-900 text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gray-900/20 active:scale-95 transition-all"
                        >
                            Close Message
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagement;
