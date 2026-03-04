// src/components/CreateUser.js
import React, { useState } from 'react';

import apiClient from '../services/apiClient';
const CreateUser = ({ onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await apiClient.post('/auth/signup', { name, email, password, phone, role }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('User created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('customer');
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error) {
      setMessage('Failed to create user. Check if email already exists.');
    }
  };

  return (
    <div className="p-5 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight text-center md:text-left">Create New User Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Secure Password"
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            required
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Account Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="customer">Customer (Regular User)</option>
            <option value="delivery">Delivery Partner (Agent)</option>
            <option value="admin">Admin (Full Access)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all uppercase tracking-widest mt-4"
        >
          {message === 'User created successfully!' ? 'USER CREATED ✅' : 'CREATE ACCOUNT'}
        </button>
      </form>
      {message && (
        <div className={`mt-6 p-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-center ${message.includes('successfully') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateUser;