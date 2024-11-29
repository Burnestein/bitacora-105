import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleReset = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/usuarios/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Contraseña restablecida con éxito.');
      } else {
        setMessage(data.error || 'Ocurrió un error.');
      }
    } catch (error) {
      setMessage('Error al restablecer contraseña.');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Restablecer</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
