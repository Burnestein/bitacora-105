import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../css/RegisterUser.css';

function RegisterUser({ onCancel }) {
  const [nombre, setNombre] = useState('');
  const [apepa, setApepa] = useState('');
  const [apemat, setApemat] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!nombre || !apepa || !apemat || !correo || !usuario || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!validateEmail(correo)) {
      setError('Correo electrónico inválido.');
      setCorreo('');
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos una mayúscula, una minúscula y un número.');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setConfirmPassword('');
      return;
    }

    try {
      const response = await fetch('https://escuelasecundaria105.uno/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apepa, apemat, correo, usuario, password, rol: 'usuario' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');
        setTimeout(onCancel, 2000);
      } else if (data.error) {
        setError(data.error);
        if (data.error.includes('correo')) setCorreo('');
        if (data.error.includes('usuario')) setUsuario('');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión.');
    }
  };

  return (
    <div className="register-user">
      <h2>Registrarse</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div>
          <label htmlFor="apepa">Apellido Paterno</label>
          <input
            type="text"
            id="apepa"
            value={apepa}
            onChange={(e) => setApepa(e.target.value)}
            placeholder="Ingresa tu apellido paterno"
            required
          />
        </div>
        <div>
          <label htmlFor="apemat">Apellido Materno</label>
          <input
            type="text"
            id="apemat"
            value={apemat}
            onChange={(e) => setApemat(e.target.value)}
            placeholder="Ingresa tu apellido materno"
            required
          />
        </div>
        <div>
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />
        </div>
        <div>
          <label htmlFor="usuario">Nombre de Usuario</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresa tu nombre de usuario"
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
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="button-container">
          <button type="button" onClick={handleRegister}>Confirmar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterUser;
