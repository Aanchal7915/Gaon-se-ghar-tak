import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { FaLeaf, FaUsers, FaClock, FaShoppingBasket, FaCheckCircle, FaSeedling, FaMapMarkedAlt } from 'react-icons/fa';

const AppointmentBookingPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        const user = JSON.parse(localStorage.getItem('user'));
        const appointmentData = {
            ...formData,
            userId: user ? user._id : null
        };

        try {
            await apiClient.post('/appointments', appointmentData);
            setStatus({ type: 'success', msg: 'Appointment booked successfully!' });
            setFormData({ name: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
        } catch (error) {
            console.error('Failed to book appointment:', error);
            setStatus({ type: 'error', msg: 'Failed to book appointment. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-2 md:py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl w-full grid lg:grid-cols-5 gap-4 lg:gap-16 items-start">
                {/* Left Side: Related Content (Laptop View Only) */}
                <div className="hidden lg:block lg:col-span-3 space-y-12 animate-fadeInLeft">
                    {/* ... (keep laptop content same) ... */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                            <FaSeedling className="animate-bounce" />
                            <span>Premium Farm Experience</span>
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 leading-[1.1]">
                            Authentic <span className="text-green-600">Farm-to-Table</span> Journey
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed text-justify">
                            Discover the secrets of 100% organic farming. Our doors are open for those who value purity and health. Whether you're interested in understanding soil health, traditional pest management, or simply want to breathe fresh air, this visit will change your perspective on food forever.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all group">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                                <FaLeaf className="text-green-600 text-2xl group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Farming</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Observe how we integrate traditional wisdom with modern sustainability to grow nutrient-rich crops without a single drop of chemical pesticides.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <FaUsers className="text-blue-600 text-2xl group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Consultation</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Spend quality time with our master farmers. Clear your doubts about organic lifestyle and learn how to start your own little kitchen garden.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form - Extremely compact for mobile, premium for laptop */}
                <div className="lg:col-span-2 w-full space-y-4 md:space-y-8 bg-white p-5 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 transition-all duration-500 transform hover:shadow-[0_20px_50px_rgba(34,197,94,0.1)]">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-green-600 font-bold text-[8px] md:text-xs uppercase tracking-widest">
                            <FaMapMarkedAlt />
                            <span>Visit Booking</span>
                        </div>
                        <h2 className="text-xl md:text-4xl font-black text-gray-900">
                            Schedule Your <span className="text-green-600 underline md:decoration-green-100 underline-offset-4 md:underline-offset-8">Visit</span>
                        </h2>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium">
                            Book your slot in less than a minute.
                        </p>
                    </div>

                    {status.msg && (
                        <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold flex items-center space-x-2 md:space-x-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 md:border-l-8 border-green-600' : 'bg-red-50 text-red-800 border-l-4 md:border-l-8 border-red-600'}`}>
                            {status.type === 'success' ? <FaCheckCircle className="text-xs md:text-xl" /> : null}
                            <span>{status.msg}</span>
                        </div>
                    )}

                    <form className="space-y-3 md:space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-3 md:space-y-5">
                            <div className="group">
                                <label htmlFor="name" className="block text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1.5 group-focus-within:text-green-600 transition-colors">Full Name *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border border-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-xs md:text-sm font-medium"
                                    placeholder="Your Full Name"
                                />
                            </div>
                            <div className="group">
                                <label htmlFor="phone" className="block text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1.5 group-focus-within:text-green-600 transition-colors">Phone Number *</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border border-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-xs md:text-sm font-medium"
                                    placeholder="Mobile Number"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-5">
                                <div className="group">
                                    <label htmlFor="preferredDate" className="block text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1.5 group-focus-within:text-green-600 transition-colors">Date *</label>
                                    <input
                                        id="preferredDate"
                                        name="preferredDate"
                                        type="date"
                                        required
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        className="block w-full px-2 md:px-5 py-2 md:py-4 bg-gray-50 border border-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-xs md:text-sm font-medium"
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="preferredTime" className="block text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1.5 group-focus-within:text-green-600 transition-colors">Time *</label>
                                    <input
                                        id="preferredTime"
                                        name="preferredTime"
                                        type="time"
                                        required
                                        value={formData.preferredTime}
                                        onChange={handleChange}
                                        className="block w-full px-2 md:px-5 py-2 md:py-4 bg-gray-50 border border-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-xs md:text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label htmlFor="message" className="block text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1.5 group-focus-within:text-green-600 transition-colors">Notes (Optional)</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="2"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="block w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border border-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-xs md:text-sm font-medium resize-none shadow-sm"
                                    placeholder="Brief message..."
                                ></textarea>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 md:py-5 px-8 border border-transparent text-xs md:text-sm font-black rounded-xl md:rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-offset-2 focus:ring-4 focus:ring-green-500/30 shadow-xl shadow-green-100 transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Securing slot...' : 'Schedule Visit Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBookingPage;
