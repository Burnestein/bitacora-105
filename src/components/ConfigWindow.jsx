// ConfigWindow.jsx
import React, { useContext } from 'react';
import { ConfigContext } from './ConfigContext'; // Importar el contexto

function ConfigWindow() {
  const { apiUrl, setIsProduction } = useContext(ConfigContext); // Usar el contexto

  const handleToggleMode = (e) => {
    setIsProduction(e.target.value === "production");
    alert(`Configuración cambiada a ${e.target.value === "production" ? "Producción" : "Pruebas"}`);
  };

  return (
    <div className="config-window">
      <h2>Configuración</h2>
      <div>
        <label>Modo:</label>
        <select onChange={handleToggleMode} defaultValue={apiUrl.includes('escuelasecundaria105.uno') ? "production" : "testing"}>
          <option value="production">Producción</option>
          <option value="testing">Pruebas</option>
        </select>
      </div>
      <p>API URL actual: {apiUrl}</p>
    </div>
  );
}

export default ConfigWindow;
