import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getOrders, createOrder } from '../services/api';
import { UseOrdersReturn, OrderFormData } from '../types';

export const useOrders = (): UseOrdersReturn => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery('orders', getOrders);

  const createOrderMutation = useMutation((orderData: OrderFormData) => createOrder(orderData), {
    onSuccess: () => {
      queryClient.invalidateQueries('orders');
    },
  });

  return {
    orders: data,
    isLoading,
    isError,
    createOrder: createOrderMutation.mutate,
    refetch,
  };
};