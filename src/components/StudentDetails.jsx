import React from 'react';

function StudentDetails({ student }) {
  if (!student) {
    return <p>No se ha seleccionado ningún alumno.</p>;
  }

  return (
    <div className="student-details">
      <h2>Detalles de {student.nombre}</h2>
      <p><strong>ID:</strong> {student.id}</p>
      <p><strong>Nombre:</strong> {student.nombre}</p>
      <p><strong>Apellido Paterno:</strong> {student.apellido_paterno}</p>
      <p><strong>Apellido Materno:</strong> {student.apellido_materno}</p>
      <p><strong>Grado:</strong> {student.grado}</p>
      <p><strong>Grupo:</strong> {student.grupo}</p>
      <p><strong>Asesor:</strong> {student.asesor}</p>
      <p><strong>Incidencias:</strong> {student.incidencias}</p>
      <p><strong>Turno:</strong> {student.turno}</p>
    </div>
  );
}

export default StudentDetails;
