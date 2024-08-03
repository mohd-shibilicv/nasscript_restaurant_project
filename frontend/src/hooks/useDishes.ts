import { useQuery } from 'react-query';
import { getDishes } from '../services/api';
import { UseDishesReturn } from '../types';

export const useDishes = (): UseDishesReturn => {
  const { data, isLoading, isError, refetch } = useQuery('dishes', getDishes);
  
  return {
    dishes: data,
    isLoading,
    isError,
    refetch,
  };
};