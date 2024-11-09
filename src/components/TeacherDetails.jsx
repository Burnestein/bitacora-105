import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';

function TeacherDetails({ teacherId, onUpdateTeacher }) {
  const { apiUrl } = useContext(ConfigContext);
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch teacher details from API
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/profesores/${teacherId}`);
        const teacherData = await response.json();
        setTeacher(teacherData);
        setEditedData(teacherData);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    if (teacherId) fetchTeacher();
  }, [teacherId, apiUrl]);

  // Handle input changes for editing
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes to the teacher
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/profesores/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedData,
          telefono: parseInt(editedData.telefono, 10),
          telefonod: parseInt(editedData.telefonod, 10),
          telefonot: parseInt(editedData.telefonot, 10),
          contra: parseInt(editedData.contra, 10),
        }),
      });

      if (!response.ok) throw new Error('Error updating teacher');
      
      const updatedTeacher = await response.json();
      setTeacher(updatedTeacher);
      onUpdateTeacher(updatedTeacher);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedData({ ...teacher });
    setIsEditing(false);
  };

  if (!teacher) return <p>No se ha seleccionado ningún profesor.</p>;

  return (
    <div className="teacher-details">
      <h2>Detalles de {teacher.nombre}</h2>
      <p><strong>ID:</strong> {teacher.id}</p>

      {loading ? (
        <p>Guardando...</p>
      ) : isEditing ? (
        <>
          <div>
            <label>Nombre: </label>
            <input type="text" name="nombre" value={editedData.nombre} onChange={handleChange} />
          </div>
          <div>
            <label>Apellido Paterno: </label>
            <input type="text" name="apepa" value={editedData.apepa} onChange={handleChange} />
          </div>
          <div>
            <label>Apellido Materno: </label>
            <input type="text" name="apemat" value={editedData.apemat} onChange={handleChange} />
          </div>
          <div>
            <label>Domicilio: </label>
            <input type="text" name="domicilio" value={editedData.domicilio} onChange={handleChange} />
          </div>
          <div>
            <label>Correo: </label>
            <input type="email" name="correo" value={editedData.correo} onChange={handleChange} />
          </div>
          <div>
            <label>Correo de emergencia: </label>
            <input type="email" name="correod" value={editedData.correod} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono: </label>
            <input type="text" name="telefono" value={editedData.telefono} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono de emergencia: </label>
            <input type="text" name="telefonod" value={editedData.telefonod} onChange={handleChange} />
          </div>
          <div>
            <label>Teléfono del tutor: </label>
            <input type="text" name="telefonot" value={editedData.telefonot} onChange={handleChange} />
          </div>
          <div>
            <label>Contraseña: </label>
            <input type="password" name="contra" value={editedData.contra} onChange={handleChange} />
          </div>
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={handleCancel} disabled={loading}>
            Cancelar
          </button>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {teacher.nombre}</p>
          <p><strong>Apellido Paterno:</strong> {teacher.apepa}</p>
          <p><strong>Apellido Materno:</strong> {teacher.apemat}</p>
          <p><strong>Domicilio:</strong> {teacher.domicilio}</p>
          <p><strong>Correo:</strong> {teacher.correo}</p>
          <p><strong>Correo de emergencia:</strong> {teacher.correod}</p>
          <p><strong>Teléfono:</strong> {teacher.telefono}</p>
          <p><strong>Teléfono de emergencia:</strong> {teacher.telefonod}</p>
          <p><strong>Teléfono del tutor:</strong> {teacher.telefonot}</p>
          <p><strong>Contraseña:</strong> ********</p>
          <button onClick={() => setIsEditing(true)}>
            Editar
          </button>
        </>
      )}
    </div>
  );
}

export default TeacherDetails;
