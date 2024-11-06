import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';  // Importa el contexto

function StudentsList({ onStudentSelect }) {
  const { apiUrl } = useContext(ConfigContext);  // Obtén apiUrl desde el contexto
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    grado: '',
    grupo: '',
    turno: ''
  });

  useEffect(() => {
    const fetchFromServer = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/alumnos`);
        if (!response.ok) throw new Error('Server request failed');
        const data = await response.json();
        
        const studentsList = data.map((student) => ({
          id: student.id,
          nombre: student.nombre,
          apellido_paterno: student.apepa,
          apellido_materno: student.apemat,
          grado: student.grado,
          grupo: student.grupo,
          turno: student.turno,
        }));
        
        const sortedStudents = studentsList.sort((a, b) => {
          const fullNameA = `${a.apellido_paterno} ${a.apellido_materno}`;
          const fullNameB = `${b.apellido_paterno} ${b.apellido_materno}`;
          return fullNameA.localeCompare(fullNameB);
        });

        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo datos del servidor:", error);
        setLoading(false);
      }
    };
    fetchFromServer();
  }, [apiUrl]);  // Vuelve a hacer fetch si apiUrl cambia

  const handleSearch = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = students.filter((student) => {
      const fullName = `${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`.toLowerCase();
      const matchesSearchTerm = fullName.includes(lowercasedTerm);
      const matchesGrado = filters.grado ? student.grado === filters.grado : true;
      const matchesGrupo = filters.grupo ? student.grupo === filters.grupo : true;
      const matchesTurno = filters.turno ? student.turno === filters.turno : true;
      return matchesSearchTerm && matchesGrado && matchesGrupo && matchesTurno;
    });

    setFilteredStudents(filtered);
    setSearchTerm('');
    setFilters({ grado: '', grupo: '', turno: '' });
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
      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filters mb-3">
        <select name="grado" className="form-select mb-2" value={filters.grado} onChange={handleFilterChange}>
          <option value="">Todos los grados</option>
          <option value="Primero">Primero</option>
          <option value="Segundo">Segundo</option>
          <option value="Tercero">Tercero</option>
        </select>
        <select name="grupo" className="form-select mb-2" value={filters.grupo} onChange={handleFilterChange}>
          <option value="">Todos los grupos</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <select name="turno" className="form-select mb-2" value={filters.turno} onChange={handleFilterChange}>
          <option value="">Todos los turnos</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
      </div>
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            <button onClick={() => onStudentSelect(student.id)}>
              {`${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentsList;
