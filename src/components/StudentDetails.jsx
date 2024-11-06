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
        setIncidencias(incidenciasData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (studentId) fetchStudentAndIncidencias();
  }, [studentId, apiUrl]);

  // Handle input changes for editing
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  // Save changes to the student
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/alumnos/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedData,
          grado: parseInt(editedData.grado, 10),
          telefono: parseInt(editedData.telefono, 10),
          telefonod: parseInt(editedData.telefonod, 10),
          telefonot: parseInt(editedData.telefonot, 10),
        }),
      });

      if (!response.ok) throw new Error('Error updating student');
      
      const updatedStudent = await response.json();
      setStudent(updatedStudent);
      onUpdateStudent(updatedStudent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedData({ ...student });
    setIsEditing(false);
  };

  // Add a new incidencia
  const handleAddIncidencia = async () => {
    if (!newIncidencia.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/alumnos/${studentId}/incidencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: newIncidencia }),
      });
      
      if (!response.ok) throw new Error('Error adding incidencia');
      
      const newIncidenciaData = await response.json();
      setIncidencias([...incidencias, { id: newIncidenciaData.id, fecha: new Date().toISOString(), texto: newIncidencia }]);
      setNewIncidencia('');
      setShowIncidenciaForm(false);
    } catch (error) {
      console.error("Error adding incidencia:", error);
    }
  };

  if (!student) return <p>No se ha seleccionado ningún alumno.</p>;

  return (
    <div className="student-details">
      <h2>Detalles de {student.nombre}</h2>
      <p><strong>ID:</strong> {student.id}</p>

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
            <label>Grado: </label>
            <select name="grado" value={editedData.grado} onChange={handleChange}>
              <option value="">Selecciona el Grado</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label>Grupo: </label>
            <select name="grupo" value={editedData.grupo} onChange={handleChange}>
              <option value="">Selecciona el Grupo</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div>
            <label>Turno: </label>
            <select name="turno" value={editedData.turno} onChange={handleChange}>
              <option value="">Selecciona el Turno</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
            </select>
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
          <p><strong>Nombre:</strong> {student.nombre}</p>
          <p><strong>Apellido Paterno:</strong> {student.apepa}</p>
          <p><strong>Apellido Materno:</strong> {student.apemat}</p>
          <p><strong>Grado:</strong> {student.grado}</p>
          <p><strong>Grupo:</strong> {student.grupo}</p>
          <p><strong>Turno:</strong> {student.turno}</p>
          <button onClick={() => setIsEditing(true)}>
            Editar
          </button>

          <h3>Incidencias</h3>
          <ul>
            {incidencias.map((incidencia) => (
              <li key={incidencia.id}>
                <p>{new Date(incidencia.fecha).toLocaleString()}</p>
                <p>{incidencia.texto}</p>
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
            <button onClick={() => setShowIncidenciaForm(true)}>Nueva Incidencia</button>
          )}
        </>
      )}
    </div>
  );
}

export default StudentDetails;
