import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';  // Importa el contexto

function TeacherList({ onTeacherSelect }) {
  const { apiUrl } = useContext(ConfigContext);  // Obtén apiUrl desde el contexto
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/profesores`);
        if (!response.ok) throw new Error('Server request failed');
        const data = await response.json();

        const sortedTeachers = data.sort((a, b) => {
          const fullNameA = `${a.apepa} ${a.apemat}`;
          const fullNameB = `${b.apepa} ${b.apemat}`;
          return fullNameA.localeCompare(fullNameB);
        });

        setTeachers(sortedTeachers);
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo datos del servidor:", error);
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [apiUrl]);

  const handleSearch = () => {
    const filtered = teachers.filter((teacher) =>
      `${teacher.apepa} ${teacher.apemat} ${teacher.nombre}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTeachers(filtered);
  };

  if (loading) {
    return <p>Cargando profesores...</p>;
  }

  if (teachers.length === 0) {
    return <p>No hay profesores disponibles.</p>;
  }

  return (
    <div className="teacher-list">
      <h2>Lista de Profesores</h2>
      <div className="search-bar mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
      </div>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            <button onClick={() => onTeacherSelect(teacher.id)}>
              {`${teacher.apepa} ${teacher.apemat}, ${teacher.nombre}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherList;
