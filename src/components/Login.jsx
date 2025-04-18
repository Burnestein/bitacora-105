// Login.jsx

import React, { useState } from 'react';
import RegisterUser from './RegisterUser'; // Importa el componente de registro
import PasswordRecovery from './PasswordRecovery'; // Importa el componente de recuperación de contraseña
import '../css/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // Estado para alternar entre login y registro
  const [showRecovery, setShowRecovery] = useState(false); // Estado para alternar entre login y recuperación

  const handleLogin = async () => {
    try {
      const response = await fetch('https://escuelasecundaria105.uno/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: email, correo: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verificar si el usuario está activo
        if (!data.user) {
          setError('Usuario inactivo. Contacta al administrador.');
          return;
        }

        // Guarda el token y otros datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.user.rol); // Guardamos el rol del usuario
        localStorage.setItem('nombreUsuario', `${data.user.nombre} ${data.user.apepa}`);
        localStorage.setItem('usuario_id', data.user.id);
        localStorage.setItem('usuario', data.user.usuario);
        onLogin(); // Cambia al Dashboard
      } else {
        setError(data.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión');
    }
  };

  return showRegister ? (
    <RegisterUser onCancel={() => setShowRegister(false)} /> // Muestra el formulario de registro si está activo
  ) : showRecovery ? (
    <PasswordRecovery onCancel={() => setShowRecovery(false)} /> // Muestra el formulario de recuperación de contraseña
  ) : (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email">Correo Electrónico o Usuario</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo o usuario"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-container">
          <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
          <button type="button" onClick={() => setShowRegister(true)}>Registrarse</button>
          <button type="button" className="recover-password" onClick={() => setShowRecovery(true)}>
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
