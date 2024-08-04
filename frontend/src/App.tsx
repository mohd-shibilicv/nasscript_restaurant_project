import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import DashboardPage from './pages/DashboardPage';
import DishesPage from './pages/DishesPage';
import OrdersPage from './pages/OrdersPage';
import NotFound404 from './components/Layout/NotFound404';

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
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;