import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';  // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';  // Importa las funciones para interactuar con Firestore

function StudentsList() {
  // Estado para almacenar la lista de alumnos, inicializado como un arreglo vacío
  const [students, setStudents] = useState([]);
  
  // Estado para manejar el indicador de carga (mientras se obtienen los datos)
  const [loading, setLoading] = useState(true);

  // Función que carga los datos de la colección 'alumnos' desde Firestore
  const loadStudentsFromFirestore = async () => {
    try {
      // Obtén la referencia de la colección 'alumnos' en Firestore
      const studentsCollection = collection(db, 'alumnos');
      
      // Obtén los documentos de la colección
      const studentSnapshot = await getDocs(studentsCollection);
      
      // Mapea los documentos obtenidos y construye una lista de alumnos
      const studentsList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  // Extrae los datos de cada documento
      }));
      
      // Actualiza el estado con la lista de alumnos obtenida
      setStudents(studentsList);
      
      // Establece `loading` como false, indicando que los datos ya fueron cargados
      setLoading(false);
    } catch (error) {
      // Manejo de errores en caso de que ocurra un problema al cargar los datos
      console.error("Error loading students: ", error);
      
      // Detiene el estado de carga si ocurre un error
      setLoading(false);
    }
  };

  // Hook useEffect para cargar los datos de alumnos cuando el componente se monta
  useEffect(() => {
    loadStudentsFromFirestore();  // Llama a la función para cargar los alumnos
  }, []);  // El array vacío indica que este efecto solo se ejecuta una vez, al montar el componente

  // Si los datos aún están cargándose, muestra un mensaje de carga
  if (loading) {
    return <p>Cargando alumnos...</p>;
  }

  // Si no hay alumnos después de cargar los datos, muestra un mensaje indicándolo
  if (students.length === 0) {
    return <p>No hay alumnos disponibles.</p>;
  }

  // Si los alumnos han sido cargados correctamente, renderiza la lista de alumnos
  return (
    <div className="students-list">
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {/* Muestra el nombre y apellidos de cada alumno */}
            {student.nombre} {student.apellido_paterno} {student.apellido_materno}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsList;
