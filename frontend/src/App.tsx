import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import DashboardPage from './pages/DashboardPage';
import DishesPage from './pages/DishesPage';
import OrdersPage from './pages/OrdersPage';
import NotFound404 from './components/Layout/NotFound404';
import BillsPage from './pages/BillsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dishes" element={<DishesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/bills" element={<BillsPage />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;