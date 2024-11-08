import React, { useState, useEffect } from 'react';
import StudentsList from './StudentsList';
import TeacherList from './TeacherList'; // Importa el componente TeacherList
import StudentDetails from './StudentDetails';
import AddStudentForm from './AddStudentForm';
import AddTeacherForm from './AddTeacherForm';
import ConfigWindow from './ConfigWindow';

function MainContent({ view }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [apiUrl, setApiUrl] = useState('https://escuelasecundaria105.uno/'); // Estado para la URL de la API

  useEffect(() => {
    setSelectedStudentId(null);
  }, [view]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
  };

  return (
    <div className="main-content">
      {view === 'Inicio' && (
        <div>
          <h2>Página de Inicio</h2>
          <p>Bienvenido a la bitácora de incidencias.</p>
        </div>
      )}

      {view === 'Lista de Alumnos' && !selectedStudentId && (
        <StudentsList onStudentSelect={handleStudentSelect} apiUrl={apiUrl} />
      )}

      {view === 'Lista de Profesores' && (
        <TeacherList apiUrl={apiUrl} />
      )}

      {selectedStudentId && (
        <StudentDetails studentId={selectedStudentId} apiUrl={apiUrl} onUpdateStudent={() => setSelectedStudentId(null)} />
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm apiUrl={apiUrl} />
      )}

      {view === 'Agregar Profesor' && (
        <AddTeacherForm apiUrl={apiUrl} />
      )}

      {view === 'Configuración' && (
        <ConfigWindow apiUrl={apiUrl} setApiUrl={setApiUrl} />  // Cargar ventana de configuración
      )}
    </div>
  );
}

export default MainContent;
