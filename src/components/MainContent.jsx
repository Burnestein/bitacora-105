import React, { useState, useEffect } from 'react';
import StudentsList from './StudentsList';
import StudentDetails from './StudentDetails';
import AddStudentForm from './AddStudentForm';  // Importamos el formulario para agregar alumnos

function MainContent({ view }) {
  const [selectedStudent, setSelectedStudent] = useState(null);  // Estado para el alumno seleccionado

  useEffect(() => {
    // Cuando la vista cambie desde el Sidebar, restablece el alumno seleccionado
    setSelectedStudent(null);
  }, [view]);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);  // Establece el alumno seleccionado
  };

  return (
    <div className="main-content">
      {view === 'Inicio' && (
        <div>
          <h2>Página de Inicio</h2>
          <p>Bienvenido a la bitácora de incidencias.</p>
        </div>
      )}
      
      {view === 'Lista de Alumnos' && !selectedStudent && (
        <StudentsList onStudentSelect={handleStudentSelect} />  // Lista de Alumnos
      )}

      {selectedStudent && (
        <StudentDetails student={selectedStudent} />  // Detalles del Alumno
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm />  // Ahora cargamos el formulario de agregar alumno
      )}
    </div>
  );
}

export default MainContent;
