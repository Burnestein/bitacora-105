import React, { useState, useEffect } from 'react';
import StudentsList from './StudentsList';
import TeacherList from './TeacherList';
import StudentDetails from './StudentDetails';
import TeacherDetails from './TeacherDetails';
import AddStudentForm from './AddStudentForm';
import AddTeacherForm from './AddTeacherForm';
import ConfigWindow from './ConfigWindow';

function MainContent({ view }) {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [apiUrl, setApiUrl] = useState('https://escuelasecundaria105.uno/');

  useEffect(() => {
    setSelectedStudentId(null);
    setSelectedTeacherId(null);
  }, [view]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacherId(teacherId);
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

      {selectedStudentId && (
        <StudentDetails studentId={selectedStudentId} apiUrl={apiUrl} onUpdateStudent={() => setSelectedStudentId(null)} />
      )}

      {view === 'Lista de Profesores' && !selectedTeacherId && (
        <TeacherList onTeacherSelect={handleTeacherSelect} apiUrl={apiUrl} />
      )}

      {selectedTeacherId && (
        <TeacherDetails teacherId={selectedTeacherId} apiUrl={apiUrl} onUpdateTeacher={() => setSelectedTeacherId(null)} />
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm apiUrl={apiUrl} />
      )}

      {view === 'Agregar Profesor' && (
        <AddTeacherForm apiUrl={apiUrl} />
      )}

      {view === 'Configuración' && (
        <ConfigWindow apiUrl={apiUrl} setApiUrl={setApiUrl} />
      )}
    </div>
  );
}

export default MainContent;
