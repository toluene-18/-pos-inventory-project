import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './pages/AppLayout';
import DashboardHome from './pages/DashboardHome';
import PointOfSale from './pages/PointOfSale';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import Restock from './pages/Restock';
import Reports from './pages/Reports';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import usePageNavigate from './hooks/usePageNavigate';
import { clearAuth, getStoredUser } from './services/api';

/** Pages without a real screen yet — RoleRoute shows a placeholder or "restricted". */
const UPCOMING = [];

function App() {
  const navigate = useNavigate();
  const go = usePageNavigate();
  const [user, setUser] = useState(getStoredUser);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    navigate('/dashboard', { replace: true });
  }

  function handleLogout() {
    clearAuth();
    setUser(null);
    navigate('/login', { replace: true });
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <RoleRoute user={user} name="Dashboard">
              <DashboardHome user={user} onNavigate={go} />
            </RoleRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <RoleRoute user={user} name="Point of Sale">
              <PointOfSale user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/products"
          element={
            <RoleRoute user={user} name="Products">
              <Products user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <RoleRoute user={user} name="Inventory">
              <Inventory user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <RoleRoute user={user} name="Sales">
              <Sales user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleRoute user={user} name="Settings">
              <Settings user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/restock"
          element={
            <RoleRoute user={user} name="Restock">
              <Restock user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <RoleRoute user={user} name="Reports">
              <Reports user={user} onSessionExpired={handleLogout} />
            </RoleRoute>
          }
        />
        {UPCOMING.map(([path, name]) => (
          <Route
            key={path}
            path={path}
            element={<RoleRoute user={user} name={name} />}
          />
        ))}
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
