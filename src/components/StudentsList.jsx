import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

function StudentsList({ onStudentSelect }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    grado: '',
    grupo: '',
    turno: ''
  });

  const loadStudentsFromFirestore = async () => {
    try {
      const studentsCollection = collection(db, 'alumnos');
      const studentSnapshot = await getDocs(studentsCollection);
      const studentsList = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sortedStudents = studentsList.sort((a, b) => {
        const fullNameA = `${a.apellido_paterno} ${a.apellido_materno}`;
        const fullNameB = `${b.apellido_paterno} ${b.apellido_materno}`;
        return fullNameA.localeCompare(fullNameB);
      });

      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);  // Inicialmente, la lista filtrada es la misma
      setLoading(false);
    } catch (error) {
      console.error("Error loading students: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentsFromFirestore();
  }, []);

  const handleSearch = () => {
    const lowercasedTerm = searchTerm.toLowerCase();

    const filtered = students.filter(student => {
      const fullName = `${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`.toLowerCase();

      // Verifica que coincida con el término de búsqueda y los filtros seleccionados
      const matchesSearchTerm = fullName.includes(lowercasedTerm);
      const matchesGrado = filters.grado ? student.grado === filters.grado : true;
      const matchesGrupo = filters.grupo ? student.grupo === filters.grupo : true;
      const matchesTurno = filters.turno ? student.turno === filters.turno : true;

      // Solo incluir si coinciden todos los criterios
      return matchesSearchTerm && matchesGrado && matchesGrupo && matchesTurno;
    });

    setFilteredStudents(filtered);

    // Limpia los campos de búsqueda y filtros
    setSearchTerm('');  // Limpia el campo de búsqueda
    setFilters({
      grado: '',
      grupo: '',
      turno: ''
    });  // Limpia los filtros
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <p>Cargando alumnos...</p>;
  }

  if (students.length === 0) {
    return <p>No hay alumnos disponibles.</p>;
  }

  return (
    <div className="students-list">
      <h2>Lista de Alumnos</h2>

      {/* Buscador */}
      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <div className="filters mb-3">
        <select
          name="grado"
          className="form-select mb-2"
          value={filters.grado}
          onChange={handleFilterChange}
        >
          <option value="">Todos los grados</option>
          <option value="Primero">Primero</option>
          <option value="Segundo">Segundo</option>
          <option value="Tercero">Tercero</option>
        </select>

        <select
          name="grupo"
          className="form-select mb-2"
          value={filters.grupo}
          onChange={handleFilterChange}
        >
          <option value="">Todos los grupos</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        <select
          name="turno"
          className="form-select mb-2"
          value={filters.turno}
          onChange={handleFilterChange}
        >
          <option value="">Todos los turnos</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
        </select>

        <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
      </div>

      {/* Lista filtrada */}
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <button onClick={() => onStudentSelect(student)}>
              {`${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsList;
