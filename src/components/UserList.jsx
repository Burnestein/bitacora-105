import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/UserList.css';

function UserList({ onUserSelect, setView }) {
  const { apiUrl } = useContext(ConfigContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/usuarios`);
        if (!response.ok) throw new Error('Error fetching users');
        const data = await response.json();

        const usersList = data.map(user => ({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apepa,
          usuario: user.usuario,
          rol: user.rol,
          activo: user.activo,
          imagen: user.imagen || "/default-user.jpg", // Ruta de imagen de perfil
        }));

        setUsers(usersList);
        setFilteredUsers(usersList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  const handleSearch = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = users.filter(user => {
      const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
      const matchesName = fullName.includes(lowercasedTerm);
      const matchesUsername = user.usuario.toLowerCase().includes(lowercasedTerm);
      const matchesRole = roleFilter ? user.rol === roleFilter : true;
      return (matchesName || matchesUsername) && matchesRole;
    });

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleCreateUser = () => {
    setView('Agregar Usuario');
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (users.length === 0) return <p>No hay usuarios disponibles.</p>;

  return (
    <div className="user-list">
      <h2>Lista de Usuarios</h2>
      
      <button className="btn btn-success mb-3" onClick={handleCreateUser}>
        Crear Usuario
      </button>

      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o usuario"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="role-filter mb-3">
        <select
          className="form-select"
          value={roleFilter}
          onChange={handleRoleChange}
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="profesor">Profesor</option>
          <option value="usuario">Usuario</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
      </div>

      <div className="user-list-container">
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>
              <button onClick={() => onUserSelect(user.id)}>
                <img src={user.imagen} alt="Perfil" className="profile-pic" />
                <div className="user-info">
                  <span className="user-name">{`${user.nombre} ${user.apellido}`}</span>
                  <span className="user-details">{user.usuario} - {user.rol} - {user.activo ? 'Activo' : 'Inactivo'}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserList;
