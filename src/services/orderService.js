// src/services/orderService.js


const API_URL = '/orders';

const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post(API_URL, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default {
  createOrder,
};