// RestaurantDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchDashboardData } from "@/services/api";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { DashboardData } from "@/types";
import {
  TrendingUpIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import Loader from "@/components/Layout/Loader";
import Layout from "@/components/Layout/Layout";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const RestaurantDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("week");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  console.log(dashboardData);

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData(timeRange);
      setDashboardData(data);
    };
    loadDashboardData();
  }, [timeRange]);

  if (!dashboardData) return <Loader />;

  const totalIncome = dashboardData.total_income ?? 0;

  const newCustomers = dashboardData.new_customers ?? 0;
  const totalOrders = dashboardData.total_orders ?? 0;
  const avgOrderValue = dashboardData.avg_order_value ?? 0;
  const dailySales = dashboardData.daily_sales ?? [];
  const topDishes = dashboardData.top_dishes ?? [];
  const categorySales = dashboardData.category_sales ?? [];

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4">
            Dashboard
          </h1>

          <div className="mb-4">
            <Select onValueChange={setTimeRange} defaultValue={timeRange}>
              <SelectTrigger className="w-[180px] outline-none ring-offset-0">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Total Income"
            value={`$${totalIncome.toLocaleString()}`}
            icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />}
            trend={dashboardData.total_income_trend}
          />
          <DashboardCard
            title="New Customers"
            value={newCustomers}
            icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
            trend={dashboardData.new_customers}
          />
          <DashboardCard
            title="Total Orders"
            value={totalOrders}
            icon={
              <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
            }
            trend={dashboardData.total_orders_trend}
          />
          <DashboardCard
            title="Average Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
            icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />}
            trend={dashboardData.avg_order_value_trend}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Daily Sales</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="total_sales"
                    stroke="#8884d8"
                    name="Total Sales ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="order_count"
                    stroke="#82ca9d"
                    name="Order Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Top Dishes</h3>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDishes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dish__name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sales by Category</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ dish__category__name, percent }) =>
                    `${dish__category__name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categorySales.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RestaurantDashboard;
