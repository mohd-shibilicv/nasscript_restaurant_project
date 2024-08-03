import axios from 'axios';
import { Dish, ApiResponse, Category, Order, OrderFormData, AnalyticsData } from '../types';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getCategories = () => api.get<ApiResponse<Category>>('/categories').then(response => response.data);
export const getDishes = () => api.get<ApiResponse<Dish>>('/dishes/').then(response => response.data);
export const getOrders = () => api.get<ApiResponse<Order>>('/orders/').then(response => response.data);
export const createOrder = (orderData: OrderFormData) => api.post<Order>('/orders/', orderData).then(response => response.data);
export const getAnalytics = () => api.get<AnalyticsData>('/orders/analytics/').then(response => response.data);
