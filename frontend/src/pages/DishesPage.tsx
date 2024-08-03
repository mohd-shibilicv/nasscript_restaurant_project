import React from 'react';
import Layout from '../components/Layout/Layout';
import DishList from '../components/Dishes/DishList';
import { useDishes } from '../hooks/useDishes';

const DishesPage: React.FC = () => {
  const { dishes, isLoading, isError } = useDishes();
  const data = dishes?.results ? dishes.results : []

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dishes</div>;

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Dishes</h1>
      <DishList dishes={data} />
    </Layout>
  );
};

export default DishesPage;
