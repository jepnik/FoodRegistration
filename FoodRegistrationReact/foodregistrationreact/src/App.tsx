import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Layout from './shared/Layout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './home/HomePage';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import Login from './account/Login';
import RegisterUser from './account/RegisterUser';
import Profile from './pages/ProfileView';
import ChangePassword from './account/ChangePassword';
import './App.css';

const PathListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem('currentPath', location.pathname);
  }, [location]);

  return null;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath && redirectPath !== '/login') {
        navigate(redirectPath);
        sessionStorage.removeItem('redirectPath'); // Clear the stored path after navigation
      }
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <PathListener />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />

        {/* Protected routes */}
        <Route
          element={
            <Layout>
              <PrivateRoute />
            </Layout>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateItem />} />
          <Route path="/update/:id" element={<UpdateItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
