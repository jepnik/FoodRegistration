import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import HomePage from './home/HomePage';
import CreateItem from './create/CreateItem'; 
import UpdateItem from './update/UpdateItem';
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
