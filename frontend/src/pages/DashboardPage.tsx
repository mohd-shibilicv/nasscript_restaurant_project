import React from 'react';
import { useQuery } from 'react-query';
import { getAnalytics } from '../services/api';
import Layout from '../components/Layout/Layout';
import { AnalyticsData } from '../types';

const DashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery<AnalyticsData>('analytics', getAnalytics);

  if (isLoading) return <Layout>Loading...</Layout>;
  if (isError) return <Layout>Error loading analytics</Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Income</h2>
            <p className="text-3xl font-bold">${data.total_income.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">New Customers</h2>
            <p className="text-3xl font-bold">{data.new_customers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Daily Sales</h2>
            {/* Add a chart component here to display daily sales data */}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;