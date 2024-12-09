import React, { useState, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/AddUserForm.css';

function AddUserForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [apepa, setApepa] = useState('');
  const [apemat, setApemat] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [rol, setRol] = useState('usuario');
  const [correo, setCorreo] = useState('');
  const [message, setMessage] = useState('');
  const { apiUrl } = useContext(ConfigContext);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newUser = { nombre, telefono, usuario, password, apepa, apemat, domicilio, rol, correo };

    try {
      const response = await fetch(`${apiUrl}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Usuario agregado exitosamente');
        // Limpia los campos del formulario
        setNombre('');
        setTelefono('');
        setUsuario('');
        setPassword('');
        setApepa('');
        setApemat('');
        setDomicilio('');
        setRol('usuario');
        setCorreo('');
      } else {
        setMessage(data.error || 'Error al agregar usuario');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMessage('Error de conexión');
    }
  };

  return (
    <div className="add-user-form">
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleAddUser}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <div>
          <label>Usuario:</label>
          <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Apellido Paterno:</label>
          <input type="text" value={apepa} onChange={(e) => setApepa(e.target.value)} />
        </div>
        <div>
          <label>Apellido Materno:</label>
          <input type="text" value={apemat} onChange={(e) => setApemat(e.target.value)} />
        </div>
        <div>
          <label>Domicilio:</label>
          <input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
        </div>
        <div>
          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <option value="admin">Admin</option>
            <option value="profesor">Profesor</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <button type="submit">Agregar Usuario</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUserForm;
