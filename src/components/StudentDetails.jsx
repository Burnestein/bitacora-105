import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';

function StudentDetails({ studentId, onUpdateStudent }) {
  const { apiUrl } = useContext(ConfigContext);
  const [student, setStudent] = useState(null);
  const [incidencias, setIncidencias] = useState([]);
  const [newIncidencia, setNewIncidencia] = useState('');
  const [showIncidenciaForm, setShowIncidenciaForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingIncidencia, setEditingIncidencia] = useState(null);
  const [editedIncidenciaText, setEditedIncidenciaText] = useState('');

  const userRole = localStorage.getItem('rol');
  const userId = localStorage.getItem('usuario_id'); // ID del usuario actual

  // Fetch student details and incidencias from API
  useEffect(() => {
    const fetchStudentAndIncidencias = async () => {
      try {
        const studentResponse = await fetch(`${apiUrl}/api/alumnos/${studentId}`);
        const studentData = await studentResponse.json();
        setStudent(studentData);
        setEditedData(studentData);

        const incidenciasResponse = await fetch(`${apiUrl}/api/alumnos/${studentId}/incidencias`);
        const incidenciasData = await incidenciasResponse.json();
        console.log("Fetched incidencias:", incidenciasData); // Debug log
        setIncidencias(
          incidenciasData.map((incidencia) => ({
            ...incidencia,
            creador: incidencia.creador || 'Desconocido',
          }))
        );
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (studentId) fetchStudentAndIncidencias();
  }, [studentId, apiUrl]);

  // Add a new incidencia
  const handleAddIncidencia = async () => {
    if (!newIncidencia.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/incidencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, texto: newIncidencia, usuario_id: userId }),
      });

      if (!response.ok) throw new Error('Error adding incidencia');

      const newIncidenciaData = await response.json();
      setIncidencias([
        ...incidencias,
        {
          id: newIncidenciaData.id,
          fecha: new Date().toISOString(),
          texto: newIncidencia,
          usuario_id: userId,
          creador: localStorage.getItem('nombreUsuario'),
        },
      ]);
      setNewIncidencia('');
      setShowIncidenciaForm(false);
    } catch (error) {
      console.error("Error adding incidencia:", error);
    }
  };

  // Enable editing mode for an incidencia
  const startEditingIncidencia = (incidencia) => {
    if (incidencia.usuario_id === userId) {
      setEditingIncidencia(incidencia.id);
      setEditedIncidenciaText(incidencia.texto);
    } else {
      alert('Solo el creador de esta incidencia puede editarla.');
    }
  };

  // Cancel editing an incidencia
  const cancelEditingIncidencia = () => {
    setEditingIncidencia(null);
    setEditedIncidenciaText('');
  };

  // Save edited incidencia text
  const saveEditedIncidencia = async (incidenciaId) => {
    try {
      const incidenciaToUpdate = incidencias.find((inc) => inc.id === incidenciaId);

      if (!incidenciaToUpdate) {
        console.error("Incidencia no encontrada en el estado.");
        return;
      }

      const response = await fetch(`${apiUrl}/api/incidencias/${incidenciaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          texto: editedIncidenciaText,
          usuario_id: incidenciaToUpdate.usuario_id,
        }),
      });

      if (!response.ok) throw new Error('Error updating incidencia');

      setIncidencias((prev) =>
        prev.map((incidencia) =>
          incidencia.id === incidenciaId
            ? { ...incidencia, texto: editedIncidenciaText }
            : incidencia
        )
      );
      setEditingIncidencia(null);
      setEditedIncidenciaText('');
    } catch (error) {
      console.error('Error updating incidencia:', error);
    }
  };

  if (!student) return <p>No se ha seleccionado ningún alumno.</p>;

  console.log("User ID:", userId); // Debug log

  return (
    <div className="student-details">
      <h2>Detalles de {student.nombre}</h2>

      {isEditing ? (
        <div>
          <label>Activo: </label>
          <input
            type="checkbox"
            name="activo"
            checked={editedData.activo}
            onChange={(e) =>
              setEditedData({
                ...editedData,
                activo: e.target.checked,
              })
            }
          />
        </div>
      ) : (
        <p><strong>Estado:</strong> {student.activo ? 'Activo' : 'Inactivo'}</p>
      )}

      <p><strong>Código de Alumno:</strong> {student.codigo_alumno}</p>

      {loading ? (
        <p>Guardando...</p>
      ) : isEditing && userRole === 'admin' ? (
        <button onClick={() => setIsEditing(false)}>Cancelar edición</button>
      ) : (
        userRole === 'admin' && <button onClick={() => setIsEditing(true)}>Editar</button>
      )}

      <h3>Incidencias</h3>
      <ul>
        {incidencias.map((incidencia) => (
          <li key={incidencia.id}>
            <p><strong>Fecha:</strong> {new Date(incidencia.fecha).toLocaleString()}</p>
            {editingIncidencia === incidencia.id ? (
              <>
                <textarea
                  value={editedIncidenciaText}
                  onChange={(e) => setEditedIncidenciaText(e.target.value)}
                />
                <button onClick={() => saveEditedIncidencia(incidencia.id)}>Guardar</button>
                <button onClick={cancelEditingIncidencia}>Cancelar</button>
              </>
            ) : (
              <>
                <p><strong>Texto:</strong> {incidencia.texto}</p>
                <p><strong>Creado por:</strong> {incidencia.creador}</p>
                {/* Verifica si el usuario actual creó la incidencia antes de mostrar el botón */}
                {incidencia.usuario_id === userId && (
                  <button onClick={() => startEditingIncidencia(incidencia)}>
                    Editar
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {showIncidenciaForm ? (
        <>
          <textarea
            value={newIncidencia}
            onChange={(e) => setNewIncidencia(e.target.value)}
            placeholder="Describe la incidencia"
          />
          <button onClick={handleAddIncidencia}>Subir Incidencia</button>
          <button onClick={() => setShowIncidenciaForm(false)}>Cancelar</button>
        </>
      ) : (
        userRole !== 'usuario' && (
          <button onClick={() => setShowIncidenciaForm(true)}>Nueva Incidencia</button>
        )
      )}
    </div>
  );
}

export default StudentDetails;
