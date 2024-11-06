// ConfigContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const ConfigContext = createContext();

// Proveedor del contexto que comparte `apiUrl` y `setApiUrl`
export const ConfigProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState('http://18.119.213.232:3001'); // Valor inicial

  return (
    <ConfigContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </ConfigContext.Provider>
  );
};