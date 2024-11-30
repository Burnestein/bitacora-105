import React, { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfigContext } from './ConfigContext';
import '../css/ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { apiUrl } = useContext(ConfigContext); 
  const token = searchParams.get('token');

  const validatePassword = () => {
    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleReset = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${apiUrl}/api/usuarios/reset-password`, {
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
      setMessage('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
        <h2>Restablecer Contraseña</h2>
        <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleReset} disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Restablecer'}
        </button>
        {message && (
            <p className={message.startsWith('Contraseña') ? 'success' : 'error'}>
            {message}
            </p>
        )}
    </div>
  );
};

export default ResetPassword;
