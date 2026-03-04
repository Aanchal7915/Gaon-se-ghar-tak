// import React, { useState, useEffect } from 'react';
// import apiClient from '../services/apiClient';


// const UserManagement = ({ onUserListUpdated }) => {
//     const [users, setUsers] = useState([]);
//     const [filteredUsers, setFilteredUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeFilter, setActiveFilter] = useState('delivery'); // Default filter to 'delivery'
//     const [searchTerm, setSearchTerm] = useState('');

//     const fetchUsers = async () => {
//     setLoading(true);
//     try {
//         const response = await apiClient.get('/users'); // token auto-attached by apiClient
//         setUsers(response.data);
//         if (onUserListUpdated) {
//             onUserListUpdated();
//         }
//     } catch (error) {
//         console.error('Failed to fetch users:', error.response?.data?.message || error.message);
//     } finally {
//         setLoading(false);
//     }
// };


//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     useEffect(() => {
//         const lowercasedSearchTerm = searchTerm.toLowerCase();
//         let results = users;

//         // Apply role filter first
//         if (activeFilter !== 'all') {
//             results = users.filter(user => user.role === activeFilter);
//         }

//         // Apply search term filter
//         if (searchTerm) {
//             results = results.filter(user =>
//                 user.name.toLowerCase().includes(lowercasedSearchTerm) ||
//                 user.email.toLowerCase().includes(lowercasedSearchTerm) ||
//                 (user.phone && user.phone.toLowerCase().includes(lowercasedSearchTerm))
//             );
//         }
//         setFilteredUsers(results);
//     }, [users, activeFilter, searchTerm]);

//     const handleDeleteUser = async (userId) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this user?');
//         if (!confirmDelete) return;

//         try {
//             const token = localStorage.getItem('token');
//             await (`/users/${userId}`, {
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             alert('User deleted successfully!');
//             fetchUsers();
//         } catch (error) {
//             console.error('Failed to delete user:', error);
//             alert('Failed to delete user.');
//         }
//     };

//     if (loading) return <div className="text-center mt-10">Loading users...</div>;

//     return (
//         <div className="p-6 bg-white shadow-md rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">User Management</h2>

//             {/* Filter and Search Section */}
//             <div className="mb-6">
//                 <div className="flex space-x-4 mb-4">
//                     <button 
//                         onClick={() => setActiveFilter('all')} 
//                         className={`py-2 px-4 rounded-md ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                     >
//                         All ({users.length})
//                     </button>
//                     <button 
//                         onClick={() => setActiveFilter('customer')} 
//                         className={`py-2 px-4 rounded-md ${activeFilter === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                     >
//                         Customers ({users.filter(u => u.role === 'customer').length})
//                     </button>
//                     <button 
//                         onClick={() => setActiveFilter('delivery')} 
//                         className={`py-2 px-4 rounded-md ${activeFilter === 'delivery' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                     >
//                         Delivery Partners ({users.filter(u => u.role === 'delivery').length})
//                     </button>
//                     <button 
//                         onClick={() => setActiveFilter('admin')} 
//                         className={`py-2 px-4 rounded-md ${activeFilter === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
//                     >
//                         Admins ({users.filter(u => u.role === 'admin').length})
//                     </button>
//                 </div>
//                 <input
//                     type="text"
//                     placeholder="Search by name, email, or phone"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full p-2 border rounded-md"
//                 />
//             </div>

//             {/* User List */}
//             <div className="space-y-4">
//                 {filteredUsers.length > 0 ? (
//                     filteredUsers.map(user => (
//                         <div key={user._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
//                             <div>
//                                 <p className="font-semibold">{user.name}</p>
//                                 <span className="text-sm text-gray-500 capitalize">{user.email} | {user.role}</span>
//                                 {user.phone && <p className="text-sm text-gray-500">Phone: {user.phone}</p>}
//                             </div>
//                             <button onClick={() => handleDeleteUser(user._id)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Delete</button>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No users found for this filter.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UserManagement;

// src/components/UserManagement.js
import React, { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

const UserManagement = ({ onUserListUpdated }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasNotifiedParent, setHasNotifiedParent] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching users from /users...");
      const response = await apiClient.get("/users");
      console.log("✅ Users fetched:", response.data);

      setUsers(response.data);

      // 🔧 notify parent only once
      if (!hasNotifiedParent && onUserListUpdated) {
        onUserListUpdated();
        setHasNotifiedParent(true);
      }
    } catch (error) {
      console.error(
        "❌ Failed to fetch users:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    let results = users;

    if (activeFilter !== "all") {
      results = users.filter((user) => user.role === activeFilter);
    }

    if (searchTerm) {
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedSearchTerm) ||
          user.email.toLowerCase().includes(lowercasedSearchTerm) ||
          (user.phone &&
            user.phone.toLowerCase().includes(lowercasedSearchTerm))
      );
    }

    setFilteredUsers(results);
  }, [users, activeFilter, searchTerm]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      console.log(`🗑️ Deleting user ${userId}...`);
      await apiClient.delete(`/users/${userId}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading users...</div>;

  return (
    <div className="p-4 md:p-8 bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[2.5rem] animate-fade-in">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 tracking-tight">User Management</h2>

      {/* Filter + Search */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'All', count: users.length },
            { id: 'customer', label: 'Customers', count: users.filter((u) => u.role === "customer").length },
            { id: 'delivery', label: 'Delivery', count: users.filter((u) => u.role === "delivery").length },
            { id: 'admin', label: 'Admins', count: users.filter((u) => u.role === "admin").length }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === filter.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-gray-50 text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200"
                }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100/50 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                      user.role === 'delivery' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                    }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">{user.email}</p>
                {user.phone && (
                  <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                    <span className="opacity-50">📞</span> {user.phone}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="p-2.5 bg-red-100/50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                title="Delete User"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 font-black text-xs uppercase tracking-widest">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
