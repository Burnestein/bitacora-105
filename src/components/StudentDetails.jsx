import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function StudentDetails({ student, onUpdateStudent }) {
  const [isEditing, setIsEditing] = useState(false);  // Modo de edición
  const [editedData, setEditedData] = useState({ ...student });  // Copia editable de los datos del alumno
  const [loading, setLoading] = useState(false);  // Estado de carga para "Guardando..."

  useEffect(() => {
    setEditedData({ ...student });  // Actualiza los datos cuando el alumno cambia
  }, [student]);

  // Función para obtener los datos actualizados desde Firestore después de guardar
  const fetchUpdatedStudent = async () => {
    const studentRef = doc(db, 'alumnos', student.id);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const updatedStudent = studentSnap.data();
      onUpdateStudent(updatedStudent);  // Llamamos al callback para actualizar el alumno en el componente principal
    } else {
      console.log('No se pudo encontrar el alumno en la base de datos.');
    }
  };

  // Maneja cambios en los cuadros de texto
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

  // Guardar los cambios en Firestore
  const handleSave = async () => {
    setLoading(true);  // Iniciar el estado de carga "Guardando..."
    const { nombre, apellido_paterno, apellido_materno, grado, grupo, asesor, turno } = editedData;
    if (!nombre || !apellido_paterno || !apellido_materno || !grado || !grupo || !asesor || !turno) {
      alert('Todos los campos deben estar completos.');
      setLoading(false);  // Detener la carga si hay errores
      return;
    }

    try {
      // Actualizar en Firestore
      const studentRef = doc(db, 'alumnos', student.id);
      await updateDoc(studentRef, editedData);

      // Recargar la información actualizada desde Firestore
      await fetchUpdatedStudent();  // Actualizamos los datos más recientes
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    } finally {
      setLoading(false);  // Detener el estado de carga cuando todo esté listo
      setIsEditing(false);  // Salir del modo de edición
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditedData({ ...student });  // Restablecer los datos originales
    setIsEditing(false);  // Salir del modo de edición
  };

  if (!student) {
    return <p>No se ha seleccionado ningún alumno.</p>;
  }

  return (
    <div className="student-details">
      <h2>Detalles de {student.nombre}</h2>
      <p><strong>ID:</strong> {student.id}</p>

      {loading ? (
        <p>Guardando...</p>  // Mostrar el estado de "Guardando..." mientras se espera la confirmación
      ) : isEditing ? (
        <>
          <div>
            <label>Nombre: </label>
            <input
              type="text"
              name="nombre"
              value={editedData.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellido Paterno: </label>
            <input
              type="text"
              name="apellido_paterno"
              value={editedData.apellido_paterno}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellido Materno: </label>
            <input
              type="text"
              name="apellido_materno"
              value={editedData.apellido_materno}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Grado: </label>
            <input
              type="text"
              name="grado"
              value={editedData.grado}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Grupo: </label>
            <input
              type="text"
              name="grupo"
              value={editedData.grupo}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Asesor: </label>
            <input
              type="text"
              name="asesor"
              value={editedData.asesor}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Incidencias: </label>
            <input
              type="text"
              name="incidencias"
              value={editedData.incidencias}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Turno: </label>
            <input
              type="text"
              name="turno"
              value={editedData.turno}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button className="btn btn-secondary" onClick={handleCancel} disabled={loading}>
            Cancelar
          </button>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {student.nombre}</p>
          <p><strong>Apellido Paterno:</strong> {student.apellido_paterno}</p>
          <p><strong>Apellido Materno:</strong> {student.apellido_materno}</p>
          <p><strong>Grado:</strong> {student.grado}</p>
          <p><strong>Grupo:</strong> {student.grupo}</p>
          <p><strong>Asesor:</strong> {student.asesor}</p>
          <p><strong>Incidencias:</strong> {student.incidencias}</p>
          <p><strong>Turno:</strong> {student.turno}</p>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Editar
          </button>
        </>
      )}
    </div>
  );
}

export default StudentDetails;
