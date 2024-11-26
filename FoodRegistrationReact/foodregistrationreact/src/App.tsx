import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from './shared/Layout';
import HomePage from './home/HomePage';
import CreateItem from './pages/CreateItem'; 
import UpdateItem from './pages/UpdateItem';
import Login from './account/Login';
import './App.css';

const App: React.FC = () => {
  const userEmail = 'user@foodcompany.com'; // Example, replace with session data

  return (
    <Router>
      <Layout userEmail={userEmail}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateItem />} /> {/* New Route */}
          <Route path="/update/:id" element={<UpdateItem />} /> {/* New Route */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
