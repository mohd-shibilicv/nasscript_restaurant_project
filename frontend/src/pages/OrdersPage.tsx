import React from 'react';
import Layout from '../components/Layout/Layout';
import { useOrders } from '../hooks/useOrders';
import OrderItem from '../components/Orders/OrderItem';

const OrdersPage: React.FC = () => {
  const { orders, isLoading, isError } = useOrders();

  if (isLoading) return <Layout>Loading...</Layout>;
  if (isError) return <Layout>Error loading orders</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Orders</h1>
      {orders?.results.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
          <p className="mb-2">Status: {order.status}</p>
          <p className="mb-4">Total: ${order.total_amount.toFixed(2)}</p>
          <div>
            {order.items.map((item, index) => (
              <OrderItem key={index} orderItem={item} />
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default OrdersPage;