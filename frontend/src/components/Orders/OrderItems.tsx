import React from "react";
import { OrderItem, Dish } from "../../types";

interface OrderItemsProps {
  orderItem: OrderItem;
  dishes: Dish[];
}

const OrderItems: React.FC<OrderItemsProps> = ({ orderItem, dishes }) => {
  const dish = dishes.find(d => d.id === orderItem.dish);

  if (!dish) {
    return (
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500 text-xs">Image N/A</span>
          </div>
          <div>
            <h4 className="font-semibold">Dish not found</h4>
            <p className="text-sm text-gray-600">Quantity: {orderItem.quantity}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">Price: N/A</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h4 className="font-semibold">{dish.name}</h4>
          <p className="text-sm text-gray-600">Quantity: {orderItem.quantity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">${(dish.price * orderItem.quantity).toFixed(2)}</p>
        <p className="text-sm text-gray-600">${dish.price} each</p>
      </div>
    </div>
  );
};

export default OrderItems;