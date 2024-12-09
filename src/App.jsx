import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import { ConfigProvider } from './components/ConfigContext';
import VerifyUser from './components/VerifyUser';
import RegisterUser from './components/RegisterUser';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <div className="App">
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="*"
              element={<div>404 - Página no encontrada</div>}
            />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/verify" element={<VerifyUser />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </div>
  );
}

export default App;
