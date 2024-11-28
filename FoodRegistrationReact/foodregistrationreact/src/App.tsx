import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; // Ensure correct import for AuthContext
import Layout from './shared/Layout';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute for protected routes
import HomePage from './home/HomePage';
import CreateItem from './pages/CreateItem';
import UpdateItem from './pages/UpdateItem';
import Login from './account/Login';
import RegisterUser from './account/RegisterUser';
import Profile from './pages/ProfileView';
import ChangePassword from './account/ChangePassword';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
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
            <Route path="/profile" element={<Profile />} /> {/* Profile route */}
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
