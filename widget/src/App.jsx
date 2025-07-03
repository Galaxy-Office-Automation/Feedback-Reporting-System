import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackWidget from './Components/FeedbackWidget';
import AdminDashboard from './Pages/AdminDashboard';

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/*" element={<FeedbackWidget />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;
