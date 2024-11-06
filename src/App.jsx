import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';  // Dashboard cargará el Sidebar, Header, etc.
import Login from './components/Login';
import { ConfigProvider } from './components/ConfigContext'; // Importa ConfigProvider

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      <ConfigProvider>
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </ConfigProvider>
    </div>
  );
}

export default App;
