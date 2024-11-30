import React, { useState, useContext } from 'react';
import { ConfigContext } from './ConfigContext'; // Importar el contexto
import '../css/PasswordRecovery.css';

const PasswordRecovery = ({ onCancel }) => {
  const { apiUrl } = useContext(ConfigContext); // Obtener `apiUrl` del contexto
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRecovery = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/recovery`, { // Usar `apiUrl`
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Correo de recuperación enviado. Revisa tu bandeja.');
      } else {
        setMessage(data.error || 'Ocurrió un error.');
      }
    } catch (error) {
      setMessage('Error al enviar solicitud.');
      console.error("Error en la recuperación de contraseña:", error);
    }
  };

  return (
    <div className="password-recovery">
      <h2>Recuperar Contraseña</h2>
      <input
        type="email"
        placeholder="Introduce tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleRecovery}>Enviar</button>
      {message && <p>{message}</p>}
      <button onClick={onCancel} style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>
        Volver
      </button>
    </div>
  );
};

export default PasswordRecovery;
