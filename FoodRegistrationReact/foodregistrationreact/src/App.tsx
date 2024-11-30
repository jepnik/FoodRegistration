import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Layout from './shared/Layout';
import HomePage from './home/HomePage';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import Login from './account/Login';
import RegisterUser from './account/RegisterUser';
import Profile from './account/Profile';
import ChangePassword from './account/ChangePassword';
import './App.css';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AuthProvider>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Store the current path in session storage
  useEffect(() => {
    sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register-user" element={<RegisterUser />} />

      {/* Protected routes */}
      {isAuthenticated ? (
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateItem />} />
          <Route path="/update/:id" element={<UpdateItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        // Redirect unauthenticated users to login
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;