import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import TripsPage from '../pages/TripsPage';
import TripFormPage from '../pages/TripFormPage';
import VehiclesPage from '../pages/VehiclesPage';
import ManutencoesPage from '../pages/ManutencoesPage';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="veiculos" element={<VehiclesPage />} />
        <Route path="trips" element={<TripsPage />} />
        <Route path="trips/new" element={<TripFormPage />} />
        <Route path="trips/:id/edit" element={<TripFormPage />} />
        <Route path="manutencoes" element={<ManutencoesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
