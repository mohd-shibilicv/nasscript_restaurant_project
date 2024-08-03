import React from 'react';
import { DishItemProps } from '../../types';

const DishItem: React.FC<DishItemProps> = ({ dish }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover mb-4 rounded" />
      <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
      <p className="text-gray-600 mb-2">{dish.description}</p>
      <p className="text-lg font-bold">${dish.price}</p>
    </div>
  );
};

export default DishItem;
