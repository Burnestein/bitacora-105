import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';  // Dashboard cargará el Sidebar, Header, etc.
import Login from './components/Login';  // Importa el componente de Login

function App() {
  // Estado para manejar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función que se ejecuta cuando el usuario inicia sesión
  const handleLogin = () => {
    setIsAuthenticated(true);  // Cambia el estado para mostrar el Dashboard
  };

  return (
    <div className="App">
      {/* Si el usuario está autenticado, muestra el Dashboard, de lo contrario el Login */}
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
