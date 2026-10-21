import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { clearAuth, getStoredUser } from './services/api';

function App() {
  const navigate = useNavigate();
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
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
