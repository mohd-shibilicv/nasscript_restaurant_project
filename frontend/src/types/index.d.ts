// src/types/index.d.ts

// Basic entity types
export interface Category {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: number | Category;
}

export interface OrderItem {
  dish: number;
  quantity: number;
}

export interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  status: "pending" | "approved" | "cancelled" | "delivered";
  bill_generated: boolean;
  items: OrderItem[];
}

export interface Bill {
  id: number;
  order: number;
  total_amount: number;
  paid: boolean;
  billed_at: string;
}

export interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

// API response types
export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form types
export interface DishFormData {
  name: string;
  description: string;
  price: number;
  category: number;
  image?: File;
}

export interface OrderFormData {
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "approved" | "cancelled" | "delivered";
}

// Analytics types
export interface DailySales {
  date: string;
  total_sales: number;
  order_count: number;
}

export interface AnalyticsData {
  daily_sales: DailySales[];
  total_income: number;
  new_customers: number;
}

// Component prop types
export interface CategoryItemProps {
  category: Category;
}

export interface CategoryListProps {
  category: Category[];
}

export interface DishItemProps {
  dish: Dish;
  onAddDish: (dish: Dish) => void;
}

export interface DishListProps {
  dishes: Dish[];
  onAddDish: (dish: Dish) => void;
}

export interface OrderItemProps {
  orderItem: OrderItem;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeItem: (id: number) => void;
}

export interface OrderListProps {
  orders: Order[];
}

// Hook return types
export interface UseCategoriesReturn {
  categories: ApiResponse<Category> | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export interface UseDishesReturn {
  dishes: ApiResponse<Dish> | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  addDishToOrder: (id: number, quantity: number) => void;
}

export interface UseOrdersReturn {
  orders: ApiResponse<Order> | undefined;
  isLoading: boolean;
  isError: boolean;
  createOrder: (data: OrderFormData) => void;
  refetch: () => void;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
}

// State types (if using Redux)
export interface RootState {
  dishes: {
    items: Dish[];
    loading: boolean;
    error: string | null;
  };
  orders: {
    items: Order[];
    loading: boolean;
    error: string | null;
  };
  notifications: {
    items: Notification[];
    unreadCount: number;
  };
}

// Action types (if using Redux)
export type ActionType =
  | { type: "FETCH_DISHES_REQUEST" }
  | { type: "FETCH_DISHES_SUCCESS"; payload: Dish[] }
  | { type: "FETCH_DISHES_FAILURE"; payload: string }
  | { type: "CREATE_ORDER_REQUEST" }
  | { type: "CREATE_ORDER_SUCCESS"; payload: Order }
  | { type: "CREATE_ORDER_FAILURE"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: number };

// Utility types
export type STATUS_TYPE = "pending" | "approved" | "cancelled" | "delivered";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}
