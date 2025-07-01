import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackWidget from './Components/FeedbackWidget';
import AdminDashboard from './Pages/AdminDashboard'; // ← rename or adjust path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackWidget />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
