import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfigContext } from './ConfigContext';
import '../css/VerifyUser.css';

function VerifyUser() {
  const [status, setStatus] = useState('Verificando...'); // Estado inicial
  const [searchParams] = useSearchParams();
  const { apiUrl } = useContext(ConfigContext);

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get('token'); // Obtener el token de la URL

      if (!token) {
        setStatus('El token de verificación es inválido.');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/usuarios/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok) {
          setStatus(data.message || '¡Cuenta verificada con éxito! Ahora puedes iniciar sesión.');
        } else {
          setStatus(data.error || 'Error al verificar la cuenta.');
        }
      } catch (error) {
        console.error('Error al verificar usuario:', error);
        setStatus('Error al procesar la verificación. Inténtalo de nuevo más tarde.');
      }
    };

    verifyUser();
  }, [searchParams]);

  return (
    <div className="verify-user">
      <h1>Verificación de Cuenta</h1>
      <p>{status}</p>
    </div>
  );
}

export default VerifyUser;
