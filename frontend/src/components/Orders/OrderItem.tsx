import React from 'react';
import { OrderItemProps } from '../../types';

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
  const dish = typeof orderItem.dish === 'number' ? { name: 'Unknown', price: 0 } : orderItem.dish;

  return (
    <div className="flex justify-between items-center py-2">
      <span>{dish.name}</span>
      <span>x{orderItem.quantity}</span>
      <span>${(dish.price * orderItem.quantity).toFixed(2)}</span>
    </div>
  );
};

export default OrderItem;