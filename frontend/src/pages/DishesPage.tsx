import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import DishList from "../components/Dishes/DishList";
import { useDishes } from "../hooks/useDishes";
import OrderItem from "../components/Orders/OrderItem";
import { Dish, Category } from "../types";
import { getCategories } from "../services/api";
import { useQuery } from "react-query";

const DishesPage: React.FC = () => {
  const { dishes, isLoading, isError, addDishToOrder } = useDishes();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery("categories", getCategories);

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const data = dishes?.results ? dishes.results : [];

  const handleAddDish = (dish: Dish) => {
    addDishToOrder(dish.id, 1);
    const existingItem = orderItems.find((item) => item.id === dish.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { ...dish, quantity: 1 }]);
    }
    setIsOrderVisible(true);
  };

  const filteredDishes = selectedCategory
    ? data.filter((dish) => 
        typeof dish.category === "number"
          ? dish.category === selectedCategory
          : dish.category.id === selectedCategory
      )
    : data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dishes</div>;

  const subtotal = orderItems
    .filter((item) => typeof item.dish !== "number")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        <div className={`${isOrderVisible ? `lg:w-2/3` : `w-full`} pr-4`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Choose Categories</h2>
            <button className="text-black flex items-center">
              View all
              {/* <ChevronDown size={20} className="ml-1" /> */}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg shadow-md ${
                selectedCategory === null ? "bg-red-100 text-red-500" : "bg-white"
              }`}
            >
              All items
            </button>
            {categories?.map((category: Category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg shadow-md ${
                  selectedCategory === category.id
                    ? "bg-red-100 text-red-500"
                    : "bg-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <DishList dishes={filteredDishes} onAddDish={handleAddDish} />
        </div>
        {orderItems.length > 0 && (
          <div
            className={`lg:w-1/3 bg-white p-8 ${
              isOrderVisible ? "block" : "hidden lg:block"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">New Order</h2>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <OrderItem key={index} orderItem={item} />
              ))}
            </div>
            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>GST (10%)</span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-red-500 text-white py-3 rounded-lg mt-6">
              Checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DishesPage;
