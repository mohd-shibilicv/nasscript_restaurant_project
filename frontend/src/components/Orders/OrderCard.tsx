import React, { useState } from "react";
import { Order, Dish } from "../../types";
import OrderItems from "./OrderItems";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { useGenerateBill } from "../../hooks/useGenerateBill";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: Order;
  dishes: Dish[];
}

const OrderCard: React.FC<OrderCardProps> = ({ order, dishes }) => {
  const [status, setStatus] = useState(order.status);
  const { updateOrderStatus, isLoading: isUpdating } = useUpdateOrderStatus();
  const { generateBill, isLoading: isGeneratingBill } = useGenerateBill();
  const navigate = useNavigate()

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order['status'];
    setStatus(newStatus);
    updateOrderStatus({ orderId: order.id, status: newStatus});
  };

  // TODO: Generate order pdf, and send it to the customer provided phone number
  // raise a modal asking for a phone number,
  // then download the pdf and sent it to customer phone number
  // then generate the bill

  const handleGenerateBill = () => {
    generateBill({ orderId: order.id, totalAmount: order.total_amount });
    navigate("/bills")
  };

  return (
    <div key={order.id} className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Order #{order.id}</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={status} 
            onChange={handleStatusChange}
            className="border rounded p-1"
            disabled={isUpdating}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
            <option value="delivered">Delivered</option>
          </select>
          {status === 'delivered' && !order.bill_generated && (
            <button 
              onClick={handleGenerateBill}
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={isGeneratingBill}
            >
              Generate Bill
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Ordered on: {new Date(order.created_at).toLocaleString()}
      </p>
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <OrderItems key={index} orderItem={item} dishes={dishes} />
        ))}
      </div>
      <div className="mt-4 flex justify-end items-center">
        <span className="text-lg font-semibold">
          Total: ${order.total_amount}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;