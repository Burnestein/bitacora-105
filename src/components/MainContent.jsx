import React, { useState, useEffect, useContext } from 'react';
import StudentsList from './StudentsList';
import StudentDetails from './StudentDetails';
import AddStudentForm from './AddStudentForm';
import ConfigWindow from './ConfigWindow';
import AddUserForm from './AddUserForm';
import UserList from './UserList';
import UserDetails from './UserDetails';
import { ConfigContext } from './ConfigContext';
import '../css/MainContent.css';

function MainContent({ view, setView }) {
  const { apiUrl } = useContext(ConfigContext); // Usar el contexto para obtener la URL de la API
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
        <div className="welcome-container">
          <img 
            src="/secu105.jpeg" 
            alt="Logo de la Secundaria 105" 
            className="welcome-image"
          />
          <h1 className="welcome-text">Bienvenido al Sistema de Incidencias Académicas</h1>
        </div>
      )}

      {view === 'Lista de Alumnos' && !selectedStudentId && (
        <StudentsList onStudentSelect={handleStudentSelect} />
      )}

      {selectedStudentId && (
        <StudentDetails 
          studentId={selectedStudentId} 
          onUpdateStudent={() => setSelectedStudentId(null)} 
        />
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm />
      )}

      {view === 'Agregar Usuario' && (
        <AddUserForm />
      )}

      {view === 'Lista de Usuarios' && !selectedUserId && (
        <UserList 
          onUserSelect={handleUserSelect} 
          setView={setView} 
        />
      )}

      {selectedUserId && (
        <UserDetails 
          userId={selectedUserId} 
          onUpdateUser={() => setSelectedUserId(null)} 
        />
      )}

      {view === 'Configuración' && (
        <ConfigWindow />
      )}
    </div>
  );
}

export default MainContent;
