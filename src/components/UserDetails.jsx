import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/UserDetails.css';

function UserDetails({ userId, onUpdateUser }) {
  const { apiUrl } = useContext(ConfigContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [relatedStudents, setRelatedStudents] = useState([]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setEditedData({ ...editedData, [name]: fieldValue });
  };

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

  const handleCancel = () => {
    setEditedData({ ...user });
    setIsEditing(false);
  };

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

      const updatedRelatedStudents = await response.json();
      setRelatedStudents([...relatedStudents, updatedRelatedStudents]);
    } catch (error) {
      console.error("Error adding student relation:", error);
    }
  };

  const handleRemoveStudent = async (codigo_alumno) => {
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos/${codigo_alumno}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error removing student relation');
      alert("Relación con alumno eliminada exitosamente");

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
          <div className="user-info-field">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={editedData.nombre} onChange={handleChange} className="form-control" />
          </div>
          <div className="user-info-field">
            <label>Apellido Paterno:</label>
            <input type="text" name="apepa" value={editedData.apepa} onChange={handleChange} className="form-control" />
          </div>
          <div className="user-info-field">
            <label>Apellido Materno:</label>
            <input type="text" name="apemat" value={editedData.apemat} onChange={handleChange} className="form-control" />
          </div>
          <div className="user-info-field">
            <label>Usuario:</label>
            <input type="text" name="usuario" value={editedData.usuario} onChange={handleChange} className="form-control" />
          </div>
          <div className="user-info-field">
            <label>Correo:</label>
            <input type="email" name="correo" value={editedData.correo} onChange={handleChange} className="form-control" />
          </div>
          <div className="user-info-field">
            <label>Rol:</label>
            <select name="rol" value={editedData.rol} onChange={handleChange} className="form-select">
              <option value="admin">Administrador</option>
              <option value="profesor">Profesor</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>
          <div className="user-info-field">
            <label>Estado:</label>
            <input
              type="checkbox"
              name="activo"
              checked={editedData.activo}
              onChange={handleChange}
              className="form-check-input"
            />
            <span>{editedData.activo ? 'Activo' : 'Inactivo'}</span>
          </div>
          <div className="d-flex gap-3 mt-3">
            <button onClick={handleSave} disabled={loading} className="btn btn-success">
              Confirmar
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
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
          <button onClick={() => setIsEditing(true)} className="btn btn-warning">Editar</button>
        </>
      )}

      <h3>Agregar Relación con Alumno</h3>
      {showAddStudent ? (
        <div className="add-student-form">
          <input
            type="text"
            placeholder="Código de Estudiante"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            className="form-control"
          />
          <button onClick={handleAddStudent} className="btn btn-primary">Aceptar</button>
          <button onClick={() => setShowAddStudent(false)} className="btn btn-secondary">Cancelar</button>
        </div>
      ) : (
        <button onClick={() => setShowAddStudent(true)} className="btn btn-primary">Relacionar Alumno</button>
      )}

      <h3>Alumnos Relacionados</h3>
      <ul className="related-students-list">
        {relatedStudents.map(student => (
          <li key={student.codigo_alumno} className="related-student-item">
            {`${student.nombre} ${student.apepa} (${student.codigo_alumno})`}
            <button onClick={() => handleRemoveStudent(student.codigo_alumno)} className="btn btn-danger btn-sm">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDetails;
