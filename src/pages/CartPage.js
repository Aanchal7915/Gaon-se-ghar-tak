// import React, { useState, useEffect } from 'react';
// import { useCart } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// 

// const CartPage = () => {
//     const { cartItems, removeFromCart, updateCartQuantity, getTotalPrice, clearCart } = useCart();
//     const navigate = useNavigate();
//     const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
//     const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '' });
//     const [customerLocation, setCustomerLocation] = useState({ latitude: null, longitude: null });

//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     setCustomerLocation({
//                         latitude: position.coords.latitude,
//                         longitude: position.coords.longitude,
//                     });
//                 },
//                 (error) => {
//                     console.error('Geolocation error:', error);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by your browser.');
//         }
//     }, []);

//     const handleCheckout = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('Please log in to checkout.');
//             navigate('/login');
//             return;
//         }

//         if (cartItems.length === 0) {
//             alert('Your cart is empty.');
//             return;
//         }

//         try {
//             const orderData = {
//                 orderItems: cartItems.map(item => ({
//                     name: item.name,
//                     qty: item.qty,
//                     price: item.selectedVariant.price,
//                     product: item._id,
//                     size: item.selectedVariant.size,
//                 })),
//                 totalPrice: getTotalPrice(),
//                 customerInfo,
//                 shippingAddress,
//                 customerLocation,
//             };

//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             };

//             const orderResponse = await apiClient.post('/orders', orderData, config);
//             const createdOrder = orderResponse.data;

//             const razorpayResponse = await apiClient.post(`/orders/${createdOrder._id}/razorpay`, {}, config);
//             const razorpayOrder = razorpayResponse.data;

//             const options = {
//                 key: razorpayOrder.key_id,
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency,
//                 name: "Rohtak Shoes",
//                 description: `Order #${createdOrder.orderNumber}`,
//                 order_id: razorpayOrder.id,
//                 handler: async function (response) {
//                     await apiClient.post(
//                         `/orders/${createdOrder._id}/verify-payment`,
//                         response,
//                         config
//                     );
//                     alert("Payment successful! Your order has been placed.");
//                     clearCart();
//                     navigate('/myorders');
//                 },
//                 prefill: {
//                     email: createdOrder.user.email,
//                 },
//                 theme: {
//                     color: "#3B82F6",
//                 },
//             };
//             const rzp1 = new window.Razorpay(options);
//             rzp1.open();

//         } catch (error) {
//             console.error('Checkout failed:', error.response?.data?.message || error.message);
//             alert('Checkout failed. Please try again.');
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>
//             {cartItems.length === 0 ? (
//                 <div className="text-center text-gray-500">
//                     <p>Your cart is empty.</p>
//                 </div>
//             ) : (
//                 <form onSubmit={handleCheckout} className="bg-white shadow-md rounded-lg p-6">
//                     <div className="divide-y divide-gray-200">
//                         {cartItems.map((item) => {
//                             const availableStock = item.selectedVariant?.countInStock || 0;
//                             const unitPrice = item.selectedVariant?.price || 0;
//                             const lineTotal = unitPrice * item.qty;
//                             return (
//                                 <div key={`${item._id}-${item.selectedVariant?.size}`} className="flex justify-between items-center py-4">
//                                     <div className="flex items-center space-x-4">
//                                         <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
//                                             <p className="text-gray-600">Size: {item.selectedVariant?.size}</p>
//                                             <p className="text-gray-600">Unit: ₹{unitPrice}</p>
//                                             <p className="text-gray-800 font-semibold">Subtotal: ₹{lineTotal}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center space-x-4">
//                                         <div className="flex items-center border rounded-md">
//                                             <button 
//                                                 type="button"
//                                                 onClick={() => updateCartQuantity(item._id, item.selectedVariant.size, item.qty - 1)}
//                                                 disabled={item.qty <= 1}
//                                                 className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition-colors"
//                                             >
//                                                 -
//                                             </button>
//                                             <input 
//                                                 type="number"
//                                                 value={item.qty}
//                                                 onChange={(e) => {
//                                                     const newQty = parseInt(e.target.value, 10);
//                                                     if (!isNaN(newQty) && newQty <= availableStock) {
//                                                         updateCartQuantity(item._id, item.selectedVariant.size, newQty);
//                                                     }
//                                                 }}
//                                                 min="1"
//                                                 max={availableStock}
//                                                 className="w-12 text-center p-1 border-y-0 focus:outline-none"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => updateCartQuantity(item._id, item.selectedVariant.size, item.qty + 1)}
//                                                 disabled={item.qty >= availableStock}
//                                                 className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors"
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => removeFromCart(item._id, item.selectedVariant.size)}
//                                             className="text-red-500 hover:text-red-700 transition-colors"
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <div className="mt-6 flex flex-col space-y-4">
//                         <h2 className="text-xl font-bold">Shipping Details</h2>
//                         <input
//                             type="text"
//                             value={customerInfo.name}
//                             onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
//                             placeholder="Full Name"
//                             className="w-full px-3 py-2 border rounded-md"
//                             required
//                         />
//                          <input
//                             type="tel"
//                             value={customerInfo.phone}
//                             onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
//                             placeholder="Phone Number"
//                             className="w-full px-3 py-2 border rounded-md"
//                             required
//                         />
//                         <input
//                             type="text"
//                             value={shippingAddress.address}
//                             onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
//                             placeholder="Address"
//                             className="w-full px-3 py-2 border rounded-md"
//                             required
//                         />
//                         <input
//                             type="text"
//                             value={shippingAddress.city}
//                             onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
//                             placeholder="City"
//                             className="w-full px-3 py-2 border rounded-md"
//                             required
//                         />
//                         <input
//                             type="text"
//                             value={shippingAddress.postalCode}
//                             onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
//                             placeholder="Postal Code"
//                             className="w-full px-3 py-2 border rounded-md"
//                             required
//                         />
//                     </div>
//                     <div className="mt-6 flex justify-between items-center">
//                         <span className="text-2xl font-bold">Total: ₹{getTotalPrice()}</span>
//                         <button
//                             type="submit"
//                             className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
//                         >
//                             Proceed to Checkout
//                         </button>
//                     </div>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default CartPage;

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

import apiClient from '../services/apiClient';
const CartPage = () => {
    const { cartItems, removeFromCart, updateCartQuantity, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '' });
    const [customerLocation, setCustomerLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCustomerLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    }, []);

    const handleCheckout = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to checkout.');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    price: item.selectedVariant.price,
                    product: item._id,
                    size: item.selectedVariant.size,
                })),
                totalPrice: getTotalPrice(),
                // CORRECTED: Pass customerInfo and shippingAddress to the backend
                customerInfo,
                shippingAddress,
                customerLocation,
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const orderResponse = await apiClient.post('/orders', orderData, config);
            const createdOrder = orderResponse.data;

            const razorpayResponse = await apiClient.post(`/orders/${createdOrder._id}/razorpay`, {}, config);
            const razorpayOrder = razorpayResponse.data;

            const options = {
                key: razorpayOrder.key_id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Rohtak Grocery",
                description: `Order #${createdOrder.orderNumber}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    await apiClient.post(
                        `/orders/${createdOrder._id}/verify-payment`,
                        response,
                        config
                    );
                    alert("Payment successful! Your order has been placed.");
                    clearCart();
                    navigate('/myorders');
                },
                prefill: {
                    email: createdOrder.user.email,
                },
                theme: {
                    color: "#3B82F6",
                },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Checkout failed:', error.response?.data?.message || error.message);
            alert('Checkout failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <form onSubmit={handleCheckout} className="bg-white shadow-md rounded-lg p-6">
                    <div className="divide-y divide-gray-200">
                        {cartItems.map((item) => {
                            const availableStock = item.selectedVariant?.countInStock || 0;
                            const unitPrice = item.selectedVariant?.price || 0;
                            const lineTotal = unitPrice * item.qty;
                            return (
                                <div key={`${item._id}-${item.selectedVariant?.size}`} className="flex justify-between items-center py-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600">Pack: {item.selectedVariant?.size}</p>
                                            <p className="text-gray-600">Unit: ₹{unitPrice}</p>
                                            <p className="text-gray-800 font-semibold">Subtotal: ₹{lineTotal}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border rounded-md">
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item._id, item.selectedVariant.size, item.qty - 1)}
                                                disabled={item.qty <= 1}
                                                className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const newQty = parseInt(e.target.value, 10);
                                                    if (!isNaN(newQty) && newQty <= availableStock) {
                                                        updateCartQuantity(item._id, item.selectedVariant.size, newQty);
                                                    }
                                                }}
                                                min="1"
                                                max={availableStock}
                                                className="w-12 text-center p-1 border-y-0 focus:outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateCartQuantity(item._id, item.selectedVariant.size, item.qty + 1)}
                                                disabled={item.qty >= availableStock}
                                                className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item._id, item.selectedVariant.size)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 flex flex-col space-y-4">
                        <h2 className="text-xl font-bold">Shipping Details</h2>
                        <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                            placeholder="Address"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            placeholder="City"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                            placeholder="Postal Code"
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <span className="text-2xl font-bold">Total: ₹{getTotalPrice()}</span>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CartPage;