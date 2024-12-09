import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/ConfigWindow.css';

function ConfigWindow() {
  const { apiUrl, setIsProduction } = useContext(ConfigContext);
  const [userData, setUserData] = useState({
    nombre: '',
    telefono: '',
    usuario: '',
    password: '',
    confirmPassword: '', // Campo para confirmar contraseña
    apepa: '',
    apemat: '',
    domicilio: '',
    correo: '',
    rol: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const userRole = localStorage.getItem('rol');
  const userId = localStorage.getItem('usuario_id');

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/usuarios/${userId}`);
        if (!response.ok) throw new Error('Error fetching user data');
        const data = await response.json();
        setUserData({
          nombre: data.nombre,
          telefono: data.telefono,
          usuario: data.usuario,
          password: '', // Password field left blank for security
          confirmPassword: '', // También en blanco
          apepa: data.apepa,
          apemat: data.apemat,
          domicilio: data.domicilio,
          correo: data.correo,
          rol: data.rol,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) fetchUserData();
  }, [apiUrl, userId]);

  // Handle toggle mode for "admin" only
  const handleToggleMode = (e) => {
    setIsProduction(e.target.value === "production");
    alert(`Configuración cambiada a ${e.target.value === "production" ? "Producción" : "Pruebas"}`);
  };

  // Handle input changes for editing user data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Save edited user data
  const handleSave = async () => {
    // Validar que las contraseñas coincidan
    if (userData.password && userData.password !== userData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = userData; // Excluir confirmPassword del payload
      console.log('Datos enviados al servidor:', dataToSend); // Verificar el contenido
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) throw new Error('Error updating user data');
      alert('Datos actualizados exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="config-window">
      <h2>Configuración</h2>

      {/* Opciones de configuración solo visibles para el rol "admin" */}
      {userRole === 'admin' && (
        <div>
          <label>Modo:</label>
          <select onChange={handleToggleMode} defaultValue={apiUrl.includes('escuelasecundaria105.uno') ? "production" : "testing"}>
            <option value="production">Producción</option>
            <option value="testing">Pruebas</option>
          </select>
          <p>API URL actual: {apiUrl}</p>
        </div>
      )}

      <h3>Datos del Usuario</h3>

      {/* Formulario para visualizar y editar datos del usuario */}
      <div className="user-data">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={userData.nombre}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Teléfono:</label>
        <input
          type="text"
          name="telefono"
          value={userData.telefono}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Usuario:</label>
        <input
          type="text"
          name="usuario"
          value={userData.usuario}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Ingrese nueva contraseña"
        />

        {isEditing && (
          <>
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme la contraseña"
            />
          </>
        )}

        <label>Apellido Paterno:</label>
        <input
          type="text"
          name="apepa"
          value={userData.apepa}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Apellido Materno:</label>
        <input
          type="text"
          name="apemat"
          value={userData.apemat}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Domicilio:</label>
        <input
          type="text"
          name="domicilio"
          value={userData.domicilio}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Correo:</label>
        <input
          type="email"
          name="correo"
          value={userData.correo}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <label>Rol:</label>
        <input type="text" name="rol" value={userData.rol} disabled />
      </div>

      {isEditing ? (
        <>
          <button onClick={handleSave}>Guardar Cambios</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Editar Información</button>
      )}
    </div>
  );
}

export default ConfigWindow;
