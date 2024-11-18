import React, { useState, useEffect } from 'react';
import StudentsList from './StudentsList';
import StudentDetails from './StudentDetails';
import AddStudentForm from './AddStudentForm';
import ConfigWindow from './ConfigWindow';
import AddUserForm from './AddUserForm';
import UserList from './UserList';
import UserDetails from './UserDetails';

function MainContent({ view, setView }) { // Añadimos setView como prop
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [apiUrl, setApiUrl] = useState('https://escuelasecundaria105.uno/');

  useEffect(() => {
    setSelectedStudentId(null);
    setSelectedUserId(null);
  }, [view]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
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

      {view === 'Agregar Alumno' && (
        <AddStudentForm apiUrl={apiUrl} />
      )}

      {view === 'Agregar Usuario' && (
        <AddUserForm apiUrl={apiUrl} />
      )}

      {view === 'Lista de Usuarios' && !selectedUserId && (
        <UserList onUserSelect={handleUserSelect} setView={setView} apiUrl={apiUrl} /> // Pasamos setView a UserList
      )}

      {selectedUserId && (
        <UserDetails userId={selectedUserId} apiUrl={apiUrl} onUpdateUser={() => setSelectedUserId(null)} />
      )}

      {view === 'Configuración' && (
        <ConfigWindow apiUrl={apiUrl} setApiUrl={setApiUrl} />
      )}
    </div>
  );
}

export default MainContent;
