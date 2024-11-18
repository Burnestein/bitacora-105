import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';

function UserList({ onUserSelect, setView }) { // Asegúrate de recibir `setView` como prop
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
        }));

        setUsers(usersList);
        setFilteredUsers(usersList); // Inicialmente todos los usuarios están visibles
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
    setView('Agregar Usuario'); // Cambia la vista a "Agregar Usuario" cuando se haga clic en el botón
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

      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            <button onClick={() => onUserSelect(user.id)}>
              {`${user.nombre} ${user.apellido}`} - {user.usuario} - {user.rol} - {user.activo ? 'Activo' : 'Inactivo'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
