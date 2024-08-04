import axios from 'axios';
import { Dish, ApiResponse, Category, OrderFormData, AnalyticsData, Order, Bill } from '../types';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getCategories = () => api.get<ApiResponse<Category>>('/categories').then(response => response.data.results);
export const getDishes = () => api.get<ApiResponse<Dish>>('/dishes/').then(response => response.data);

export const getOrders = async () => {
  const response = await api.get('/orders/', {
    params: {
      expand: 'items.dish',
    },
  });
  return response.data;
};

export const fetchOrders = async (page: number) => {
  const response = await api.get(`/orders/?page=${page}`);
  return response.data;
};

export const fetchOrder = async (orderId: number) => {
  const response = await api.get(`/orders/${orderId}/`);
  return response.data;
};

export const createOrder = async (orderData: OrderFormData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: Order['status']) => {
  const response = await api.patch<Order>(`/orders/${orderId}/`, { status });
  return response.data;
};

export const deleteOrder = async (orderId: number) => {
  const response = await api.delete<Order>(`/orders/${orderId}/`);
  return response.data;
};

export const generateBill = async (orderId: number, totalAmount: number) => {
  const response = await api.post<Bill>('/bills/', { order: orderId, total_amount: totalAmount });
  return response.data;
};

export const fetchBills = async (page: number) => {
  const response = await api.get(`/bills/?page=${page}`);
  return response.data;
};

export const getAnalytics = () => api.get<AnalyticsData>('/orders/analytics/').then(response => response.data);
