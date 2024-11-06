// ConfigContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const ConfigContext = createContext();

// Proveedor del contexto que comparte `apiUrl` y `setApiUrl`
export const ConfigProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState('https://escuelasecundaria105.uno/api'); // Nuevo valor inicial con HTTPS

  return (
    <ConfigContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ConfigContext.Provider>
  );
};
