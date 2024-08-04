import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useOrders, usePaginatedOrders } from "../hooks/useOrders";
import { Order, Dish } from "../types";
import { useDishes } from "../hooks/useDishes"; // Assume this hook fetches all dishes
import OrderCard from "../components/Orders/OrderCard";
import PaginationControls from "../components/Layout/PaginationControls";

const OrderStatus: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const statusConfig = {
    pending: { color: "yellow", text: "Pending" },
    approved: { color: "indigo", text: "Approved" },
    cancelled: { color: "red", text: "Cancelled" },
    delivered: { color: "green", text: "Delivered" },
  };

  const { color, text } = statusConfig[status];

  return (
    <span
      className={`border border-${color}-500 bg-${color}-100 text-${color}-900 rounded px-2 py-1 text-sm font-medium`}
    >
      {text}
    </span>
  );
};

const OrdersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = usePaginatedOrders(currentPage);
  const {
    dishes,
    isLoading: dishesLoading,
    isError: dishesError,
  } = useDishes();

  if (ordersLoading || dishesLoading)
    return <Layout>Loading orders and dishes...</Layout>;
  if (ordersError || dishesError)
    return (
      <Layout>Error loading orders or dishes. Please try again later.</Layout>
    );

  if (!dishes || !dishes.results) {
    return <Layout>No dish data available.</Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Your Orders</h1>
      {orders?.results.length ? (
        <>
          {orders.results.map((order: any) => (
            <OrderCard key={order.id} order={order} dishes={dishes.results} />
          ))}
          <PaginationControls
            currentPage={currentPage}
            totalPages={Math.ceil(orders.count / 10)}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      )}
    </Layout>
  );
};

export default OrdersPage;
