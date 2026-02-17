// src/pages/SignupPage.js
import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            await apiClient.post('/auth/request-otp', { email });
            setMessage('OTP sent to your email.');
            setIsOtpSent(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to send OTP.');
            setIsError(true);
            console.error('OTP request error:', err);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            // First, verify the OTP
            await apiClient.post('/auth/verify-otp', { email, otp });

            // If OTP is valid, proceed with signup
            const { data } = await apiClient.post('/auth/signup', { name, email, password, phone });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setMessage('Signup successful! Redirecting to home...');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Verification or Signup failed.');
            setIsError(true);
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900">Create Your Account</h2>
                <form className="space-y-4" onSubmit={isOtpSent ? handleSignup : handleRequestOtp}>
                    {message && (
                        <p className={`text-sm text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isOtpSent}
                            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isOtpSent && 'bg-gray-200 cursor-not-allowed'}`}
                        />
                    </div>
                    {isOtpSent && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isOtpSent ? 'Verify OTP & Signup' : 'Request OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
