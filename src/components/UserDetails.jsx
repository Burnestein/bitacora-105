import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';

function UserDetails({ userId, onUpdateUser }) {
  const { apiUrl } = useContext(ConfigContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [relatedStudents, setRelatedStudents] = useState([]);

  // Fetch user details and related students from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/usuarios/${userId}`);
        const data = await response.json();
        setUser(data);
        setEditedData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchRelatedStudents = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos`);
        if (!response.ok) throw new Error('Error fetching related students');
        const data = await response.json();
        setRelatedStudents(data);
      } catch (error) {
        console.error("Error fetching related students:", error);
      }
    };

    fetchUser();
    fetchRelatedStudents();
  }, [userId, apiUrl]);

  // Handle input changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  // Save changes to the user
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) throw new Error('Error updating user');
      const updatedUser = await response.json();
      setUser(updatedUser);
      onUpdateUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedData({ ...user });
    setIsEditing(false);
  };

  // Handle adding a new student relation
  const handleAddStudent = async () => {
    if (!studentCode.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_alumno: studentCode }),
      });

      if (!response.ok) throw new Error('Error adding student relation');
      setStudentCode('');
      setShowAddStudent(false);
      alert("Relación con alumno agregada exitosamente");

      // Refetch related students after adding a new one
      const updatedRelatedStudents = await response.json();
      setRelatedStudents([...relatedStudents, updatedRelatedStudents]);
    } catch (error) {
      console.error("Error adding student relation:", error);
    }
  };

  // Handle removing a student relation
  const handleRemoveStudent = async (codigo_alumno) => {
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos/${codigo_alumno}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error removing student relation');
      alert("Relación con alumno eliminada exitosamente");

      // Refetch related students after removing one
      setRelatedStudents(relatedStudents.filter(student => student.codigo_alumno !== codigo_alumno));
    } catch (error) {
      console.error("Error removing student relation:", error);
    }
  };

  if (!user) return <p>Cargando detalles del usuario...</p>;

  return (
    <div className="user-details">
      <h2>Detalles del Usuario</h2>

      {loading && <p>Guardando...</p>}

      <p><strong>ID:</strong> {user.id}</p>

      {isEditing ? (
        <>
          <div>
            <label>Nombre:</label>
            <input type="text" name="nombre" value={editedData.nombre} onChange={handleChange} />
          </div>
          <div>
            <label>Apellido Paterno:</label>
            <input type="text" name="apepa" value={editedData.apepa} onChange={handleChange} />
          </div>
          <div>
            <label>Apellido Materno:</label>
            <input type="text" name="apemat" value={editedData.apemat} onChange={handleChange} />
          </div>
          <div>
            <label>Usuario:</label>
            <input type="text" name="usuario" value={editedData.usuario} onChange={handleChange} />
          </div>
          <div>
            <label>Correo:</label>
            <input type="email" name="correo" value={editedData.correo} onChange={handleChange} />
          </div>
          <div>
            <label>Rol:</label>
            <select name="rol" value={editedData.rol} onChange={handleChange}>
              <option value="admin">Administrador</option>
              <option value="profesor">Profesor</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          <div>
            <label>Estado:</label>
            <select name="activo" value={editedData.activo ? 'true' : 'false'} onChange={handleChange}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <button onClick={handleSave} disabled={loading}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellido Paterno:</strong> {user.apepa}</p>
          <p><strong>Apellido Materno:</strong> {user.apemat}</p>
          <p><strong>Usuario:</strong> {user.usuario}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
          <p><strong>Estado:</strong> {user.activo ? 'Activo' : 'Inactivo'}</p>
          <button onClick={() => setIsEditing(true)}>Editar</button>
        </>
      )}

      {/* Add Student Relationship Section */}
      <h3>Agregar Relación con Alumno</h3>
      {showAddStudent ? (
        <div>
          <input
            type="text"
            placeholder="Código de Estudiante"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <button onClick={handleAddStudent}>Aceptar</button>
          <button onClick={() => setShowAddStudent(false)}>Cancelar</button>
        </div>
      ) : (
        <button onClick={() => setShowAddStudent(true)}>Relacionar Alumno</button>
      )}

      {/* Related Students Section */}
      <h3>Alumnos Relacionados</h3>
      <ul>
        {relatedStudents.map(student => (
          <li key={student.codigo_alumno}>
            {`${student.nombre} ${student.apepa} (${student.codigo_alumno})`}
            <button onClick={() => handleRemoveStudent(student.codigo_alumno)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDetails;
