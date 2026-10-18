import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import UpdatePrompt from './components/UpdatePrompt';
import './index.css';

// Placeholder components
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Levels from './pages/Levels';
import GameLevel from './pages/GameLevel';
import GiftGallery from './pages/GiftGallery';
import Memories from './pages/Memories';
import Profile from './pages/Profile';
import CakeCutting from './pages/CakeCutting';

const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  if (!state.user.isOnboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

function AppRoutes() {
  const { state } = useApp();
  
  return (
    <Routes>
      <Route path="/onboarding" element={
        state.user.isOnboardingComplete ? <Navigate to="/home" replace /> : <Onboarding />
      } />
      
      <Route element={<Layout />}>
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/levels" element={<ProtectedRoute><Levels /></ProtectedRoute>} />
        <Route path="/play/:id" element={<ProtectedRoute><GameLevel /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GiftGallery /></ProtectedRoute>} />
        <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
        <Route path="/cake" element={<ProtectedRoute><CakeCutting /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to={state.user.isOnboardingComplete ? "/home" : "/onboarding"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <UpdatePrompt />
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
