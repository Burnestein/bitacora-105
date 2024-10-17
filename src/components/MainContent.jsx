import React from 'react';
import '../css/MainContent.css';
import StudentsList from './StudentList';
import AddStudentForm from './AddStudentForm';

function MainContent({ view }) {
  return (
    <div className="main-content">
      {view === 'Lista de Alumnos' && (
        <div>
          <h2>Lista de Alumnos</h2>
          <StudentsList />
        </div>
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm />  // Muestra el formulario cuando se selecciona "Agregar Alumno"
      )}
    </div>
  );
}

export default MainContent;
