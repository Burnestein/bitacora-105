import React, { useState } from 'react';
import '../css/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://escuelasecundaria105.uno/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el token en localStorage y llama a onLogin para cambiar la vista al Dashboard
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.user.rol); // Guardamos el rol del usuario
        onLogin();  // Cambia al Dashboard
      } else {
        setError(data.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión');
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
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
        <div>
          <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
          <button type="button">Registrarse</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
