import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import MyPapers from './pages/MyPapers';
import AIInsights from './pages/AIInsights';
import Career from './pages/Career';
import ResearchResources from './pages/ResearchResources';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="my-papers" element={<MyPapers />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="career" element={<Career />} />
          <Route path="resources" element={<ResearchResources />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
