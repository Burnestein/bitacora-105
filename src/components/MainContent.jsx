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

  // Función para actualizar el estudiante en el estado de `MainContent`
  const handleUpdateStudent = (updatedStudent) => {
    setSelectedStudent(updatedStudent);  // Actualiza el alumno con los datos más recientes
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
        <StudentDetails student={selectedStudent} onUpdateStudent={handleUpdateStudent} />  // Detalles del Alumno con la función para actualizar
      )}

      {view === 'Agregar Alumno' && (
        <AddStudentForm />  // Ahora cargamos el formulario de agregar alumno
      )}
    </div>
  );
}

export default MainContent;
