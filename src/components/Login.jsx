import React, { useState } from 'react';
import '../css/Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin();  // Llama a la función que cambia la vista al Dashboard
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <form>
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
        <div>
          <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
          <button type="button">Registrarse</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
