import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import HomePage from './home/HomePage';
import './App.css'; 


function App() {
  const userEmail = "user@foodcompany.com"; // Example, replace with session data

  return (
    <Router>
      <Layout userEmail={userEmail}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;