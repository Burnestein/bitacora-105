// ConfigWindow.jsx
import React, { useContext, useState } from 'react';
import { ConfigContext } from './ConfigContext'; // Importar el contexto

function ConfigWindow() {
  const { apiUrl, setApiUrl } = useContext(ConfigContext); // Usar el contexto
  const [newApiUrl, setNewApiUrl] = useState(apiUrl);

  const handleSave = () => {
    setApiUrl(newApiUrl); // Actualizar `apiUrl` en el contexto
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="config-window">
      <h2>Configuración</h2>
      <div>
        <label>API URL:</label>
        <input
          type="text"
          value={newApiUrl}
          onChange={(e) => setNewApiUrl(e.target.value)}
          placeholder="Ingrese la IP o URL del servidor"
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        Guardar Cambios
      </button>
    </div>
  );
}

export default ConfigWindow;
