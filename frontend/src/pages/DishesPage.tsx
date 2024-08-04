import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import DishList from "../components/Dishes/DishList";
import OrderItem from "../components/Orders/OrderItem";
import { useDishes } from "../hooks/useDishes";
import { useOrders } from "../hooks/useOrders";
import { Dish, Category, OrderFormData } from "../types";
import { getCategories } from "../services/api";
import { useQuery } from "react-query";
import { CircleCheckBig } from "lucide-react";

const DishesPage: React.FC = () => {
  const { dishes, isLoading, isError, addDishToOrder } = useDishes();
  const { createOrder } = useOrders();
  const { data: categories } = useQuery("categories", getCategories);

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isOrderVisible, setIsOrderVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const incrementQuantity = (id: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: number) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    const orderData: OrderFormData = {
      items: orderItems.map((item) => ({
        dish: item.id,
        quantity: item.quantity,
      })),
      total_amount: total.toFixed(2),
      status: "pending",
    };

    createOrder(orderData);
    setShowSuccessModal(true);
    setOrderItems([]);
    setIsOrderVisible(false);
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
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg shadow-md ${
                selectedCategory === null
                  ? "bg-red-100 text-red-500"
                  : "bg-white"
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
            <div className="sticky top-0">
              <h2 className="text-2xl font-bold mb-6">New Order</h2>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <OrderItem
                    key={index}
                    orderItem={item}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    removeItem={removeItem}
                  />
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
              <button
                className="w-full bg-red-500 text-white py-3 rounded-lg mt-6"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <div className="flex justify-center items-center">
              <CircleCheckBig size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Success</h2>
            <p>Your order has been placed successfully!</p>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DishesPage;
