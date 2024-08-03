import React from "react";
import { Minus, Plus } from "lucide-react";

const OrderItem: React.FC<any> = ({ orderItem }) => {

  return (
    <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg mb-2">
      <img
        src={orderItem.image}
        alt={orderItem.name}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-grow ml-4">
        <h4 className="font-semibold">{orderItem.name}</h4>
        <span className="text-red-500">${orderItem.price}</span>
      </div>
      <div className="flex items-center">
        <button className="text-gray-500">
          <Minus size={16} />
        </button>
        <span className="mx-2">x{orderItem.quantity}</span>
        <span>${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
        <button className="text-red-500">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
