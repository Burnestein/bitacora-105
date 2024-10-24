import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';  // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';  // Importa las funciones para interactuar con Firestore

function StudentsList({ onStudentSelect }) {  // Agregamos una función onStudentSelect como prop
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStudentsFromFirestore = async () => {
    try {
      const studentsCollection = collection(db, 'alumnos');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentsList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading students: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentsFromFirestore();
  }, []);

  if (loading) {
    return <p>Cargando alumnos...</p>;
  }

  if (students.length === 0) {
    return <p>No hay alumnos disponibles.</p>;
  }

  return (
    <div className="students-list">
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <button onClick={() => onStudentSelect(student)}>  {/* Cada nombre es un botón */}
              {student.nombre} {student.apellido_paterno} {student.apellido_materno}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsList;
