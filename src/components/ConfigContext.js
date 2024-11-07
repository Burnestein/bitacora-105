// ConfigContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const ConfigContext = createContext();

// Proveedor del contexto que comparte `apiUrl` y `setApiUrl`
export const ConfigProvider = ({ children }) => {
  const [isProduction, setIsProduction] = useState(true); // Estado para el modo
  const apiUrl = isProduction ? 'https://escuelasecundaria105.uno' : 'http://localhost:3001'; // Selección de URL

  return (
    <ConfigContext.Provider value={{ apiUrl, setIsProduction }}>
      {children}
    </ConfigContext.Provider>
  );
};
