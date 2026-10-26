import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import UpdatePrompt from './components/UpdatePrompt';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import './index.css';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <UpdatePrompt />
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
