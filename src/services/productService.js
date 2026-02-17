// src/services/productService.js

import apiClient from '../services/apiClient';
const API_URL = '/products';

const getProducts = async () => {
  const response = await apiClient.get(API_URL);
  return response.data;
};

const getProductById = async (id) => {
  const response = await apiClient.get(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getProducts,
  getProductById,
};