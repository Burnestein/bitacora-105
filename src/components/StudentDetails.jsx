import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/StudentDetails.css';

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
  const userId = localStorage.getItem('usuario_id');

  useEffect(() => {
    const fetchStudentAndIncidencias = async () => {
      try {
        const studentResponse = await fetch(`${apiUrl}/api/alumnos/${studentId}`);
        const studentData = await studentResponse.json();
        setStudent(studentData);
        setEditedData(studentData);

        const incidenciasResponse = await fetch(`${apiUrl}/api/alumnos/${studentId}/incidencias`);
        const incidenciasData = await incidenciasResponse.json();
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

  const startEditingIncidencia = (incidencia) => {
    if (incidencia.usuario_id.toString() === userId.toString()) {
      setEditingIncidencia(incidencia.id);
      setEditedIncidenciaText(incidencia.texto);
    } else {
      alert('Solo el creador de esta incidencia puede editarla.');
    }
  };

  const cancelEditingIncidencia = () => {
    setEditingIncidencia(null);
    setEditedIncidenciaText('');
  };

  const saveEditedIncidencia = async (incidenciaId) => {
    try {
      const incidenciaToUpdate = incidencias.find((inc) => inc.id === incidenciaId);
      if (!incidenciaToUpdate) return;

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

  const saveEditedData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/alumnos/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) throw new Error('Error updating student');

      setStudent(editedData);
      setIsEditing(false);
      onUpdateStudent();
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!student) return <p>No se ha seleccionado ningún alumno.</p>;

  return (
    <div className="student-details">
      <h2>Detalles de {student.nombre}</h2>

      {isEditing ? (
        <>
          <div className="student-info-field">
            <label>Código de Alumno:</label>
            <input
              type="text"
              value={editedData.codigo_alumno}
              onChange={(e) => setEditedData({ ...editedData, codigo_alumno: e.target.value })}
            />
          </div>
          <div className="student-info-field">
            <label>Nombre:</label>
            <input
              type="text"
              value={editedData.nombre}
              onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
            />
          </div>
          <div className="student-info-field">
            <label>Apellido Paterno:</label>
            <input
              type="text"
              value={editedData.apepa}
              onChange={(e) => setEditedData({ ...editedData, apepa: e.target.value })}
            />
          </div>
          <div className="student-info-field">
            <label>Apellido Materno:</label>
            <input
              type="text"
              value={editedData.apemat}
              onChange={(e) => setEditedData({ ...editedData, apemat: e.target.value })}
            />
          </div>
          {userRole !== 'usuario' && (
          <>
            <div className="student-info-field">
              <label>Domicilio:</label>
              <input
                type="text"
                value={editedData.domicilio}
                onChange={(e) => setEditedData({ ...editedData, domicilio: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Nombre del Padre o Tutor:</label>
              <input
                type="text"
                value={editedData.padre}
                onChange={(e) => setEditedData({ ...editedData, padre: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Parentesco:</label>
              <input
                type="text"
                value={editedData.parentezco}
                onChange={(e) => setEditedData({ ...editedData, parentezco: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Correo del Tutor:</label>
              <input
                type="email"
                value={editedData.correo_tutor}
                onChange={(e) => setEditedData({ ...editedData, correo_tutor: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Teléfono:</label>
              <input
                type="text"
                value={editedData.telefono}
                onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Teléfono del Domicilio:</label>
              <input
                type="text"
                value={editedData.telefonod}
                onChange={(e) => setEditedData({ ...editedData, telefonod: e.target.value })}
              />
            </div>
            <div className="student-info-field">
              <label>Teléfono del Tutor:</label>
              <input
                type="text"
                value={editedData.telefonot}
                onChange={(e) => setEditedData({ ...editedData, telefonot: e.target.value })}
              />
            </div>
          </>
        )}

          <div className="student-info-field">
            <label>Grado:</label>
            <select
              value={editedData.grado}
              onChange={(e) => setEditedData({ ...editedData, grado: parseInt(e.target.value) })}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="student-info-field">
            <label>Grupo:</label>
            <select
              value={editedData.grupo}
              onChange={(e) => setEditedData({ ...editedData, grupo: e.target.value })}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div className="student-info-field">
            <label>Turno:</label>
            <select
              value={editedData.turno}
              onChange={(e) => setEditedData({ ...editedData, turno: e.target.value })}
            >
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
            </select>
          </div>
          {userRole === 'admin' && (
            <div className="student-info-field">
              <label>Activo:</label>
              <input
                type="checkbox"
                checked={editedData.activo}
                onChange={(e) => setEditedData({ ...editedData, activo: e.target.checked })}
              />
            </div>
          )}
          <button className="btn btn-success" onClick={saveEditedData}>Aceptar</button>
          <button className="btn btn-danger" onClick={() => setIsEditing(false)}>Cancelar edición</button>
        </>
      ) : (
        <>
          <p><strong>Código de Alumno:</strong> {student.codigo_alumno}</p>
          <p><strong>Nombre:</strong> {student.nombre}</p>
          <p><strong>Apellido Paterno:</strong> {student.apepa}</p>
          <p><strong>Apellido Materno:</strong> {student.apemat}</p>
          {userRole !== 'usuario' && (
            <>
              <p><strong>Domicilio:</strong> {student.domicilio}</p>
              <p><strong>Padre o Tutor:</strong> {student.padre}</p>
              <p><strong>Parentesco:</strong> {student.parentezco}</p>
              <p><strong>Correo del Tutor:</strong> {student.correo_tutor}</p>
              <p><strong>Teléfono:</strong> {student.telefono}</p>
              <p><strong>Teléfono del Domicilio:</strong> {student.telefonod}</p>
              <p><strong>Teléfono del Tutor:</strong> {student.telefonot}</p>
            </>
          )}
          <p><strong>Grado:</strong> {student.grado}</p>
          <p><strong>Grupo:</strong> {student.grupo}</p>
          <p><strong>Turno:</strong> {student.turno}</p>
          <p><strong>Estado:</strong> {student.activo ? 'Activo' : 'Inactivo'}</p>
          {userRole === 'admin' && (
            <button className="btn btn-warning" onClick={() => setIsEditing(true)}>Editar</button>
          )}
        </>

      )}

      <h3>Incidencias</h3>
      <ul className="incidencias-list">
        {incidencias.map((incidencia) => (
          <li key={incidencia.id} className="incidencia-item">
            <p><strong>Fecha:</strong> {new Date(incidencia.fecha).toLocaleString()}</p>
            {editingIncidencia === incidencia.id ? (
              <>
                <textarea
                  value={editedIncidenciaText}
                  onChange={(e) => setEditedIncidenciaText(e.target.value)}
                  className="form-control"
                />
                <button className="btn btn-success" onClick={() => saveEditedIncidencia(incidencia.id)}>Guardar</button>
                <button className="btn btn-danger" onClick={cancelEditingIncidencia}>Cancelar</button>
              </>
            ) : (
              <>
                <p><strong>Texto:</strong> {incidencia.texto}</p>
                <p><strong>Creado por:</strong> {incidencia.creador}</p>
                {incidencia.usuario_id.toString() === userId.toString() && (
                  <button className="btn btn-link edit-button" onClick={() => startEditingIncidencia(incidencia)}>
                    <i className="fas fa-edit"></i> Editar
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {showIncidenciaForm ? (
        <div className="new-incidencia-form">
          <textarea
            value={newIncidencia}
            onChange={(e) => setNewIncidencia(e.target.value)}
            placeholder="Describe la incidencia"
            className="form-control"
          />
          <button className="btn btn-primary" onClick={handleAddIncidencia}>Subir Incidencia</button>
          <button className="btn btn-secondary" onClick={() => setShowIncidenciaForm(false)}>Cancelar</button>
        </div>
      ) : (
        userRole !== 'usuario' && (
          <button className="btn btn-primary" onClick={() => setShowIncidenciaForm(true)}>Nueva Incidencia</button>
        )
      )}
    </div>
  );
}

export default StudentDetails;
