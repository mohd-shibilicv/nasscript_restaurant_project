import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import NotFound404 from "./components/Layout/NotFound404";

const queryClient = new QueryClient();

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DishesPage = lazy(() => import("./pages/DishesPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const BillsPage = lazy(() => import("./pages/BillsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
// const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dishes" element={<DishesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/bills" element={<BillsPage />} />
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
