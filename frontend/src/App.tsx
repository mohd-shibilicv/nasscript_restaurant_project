import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import NotFound404 from "./components/Layout/NotFound404";
import Register from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute, { AuthenticatedRoute } from "./components/Layout/ProtectedRoute";

const queryClient = new QueryClient();

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DishesPage = lazy(() => import("./pages/DishesPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const BillsPage = lazy(() => import("./pages/BillsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/register" element={<AuthenticatedRoute><Register /></AuthenticatedRoute>} />
              <Route path="/login" element={<AuthenticatedRoute><LoginPage /></AuthenticatedRoute>} />
              <Route path="/dishes" element={<ProtectedRoute><DishesPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/bills" element={<ProtectedRoute><BillsPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
