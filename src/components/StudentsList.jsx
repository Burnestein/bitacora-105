import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './ConfigContext';
import '../css/StudentsList.css';

function StudentsList({ onStudentSelect }) {
  const { apiUrl } = useContext(ConfigContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    grado: '',
    grupo: '',
    turno: '',
    estado: 'todos',
  });
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentCode, setStudentCode] = useState('');

  const userId = localStorage.getItem('usuario_id');
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    const fetchFromServer = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/alumnos?userId=${userId}&rol=${rol}`);
        if (!response.ok) throw new Error('Server request failed');
        const data = await response.json();
        
        const studentsList = data.map((student) => ({
          id: student.id,
          codigo_alumno: student.codigo_alumno,
          nombre: student.nombre,
          apellido_paterno: student.apepa,
          apellido_materno: student.apemat,
          grado: student.grado,
          grupo: student.grupo,
          turno: student.turno,
          activo: student.activo,
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
  }, [apiUrl, userId, rol]);

  const handleSearch = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = students.filter((student) => {
      const fullName = `${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`.toLowerCase();
      const matchesSearchTerm = fullName.includes(lowercasedTerm);
      const matchesGrado = filters.grado ? student.grado === filters.grado : true;
      const matchesGrupo = filters.grupo ? student.grupo === filters.grupo : true;
      const matchesTurno = filters.turno ? student.turno === filters.turno : true;
      const matchesEstado = filters.estado === 'todos' || 
                            (filters.estado === 'activo' && student.activo) ||
                            (filters.estado === 'inactivo' && !student.activo);
      return matchesSearchTerm && matchesGrado && matchesGrupo && matchesTurno && matchesEstado;
    });

    setFilteredStudents(filtered);
    setSearchTerm('');
    setFilters({ ...filters, grado: '', grupo: '', turno: '' });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Función para manejar la relación con un alumno
  const handleAddStudent = async () => {
    if (!studentCode.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_alumno: studentCode }),
      });

      if (!response.ok) throw new Error('Error adding student relation');
      setStudentCode('');
      setShowAddStudent(false);
      alert("Relación con alumno agregada exitosamente");
    } catch (error) {
      console.error("Error adding student relation:", error);
    }
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

      {/* Botón para relacionar alumno, solo visible para el rol "usuario" */}
      {rol === 'usuario' && (
        <div className="add-student-relation">
          {showAddStudent ? (
            <div>
              <input
                type="text"
                placeholder="Código de Alumno"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="form-control mb-2"
              />
              <button className="btn btn-primary" onClick={handleAddStudent}>Aceptar</button>
              <button className="btn btn-secondary" onClick={() => setShowAddStudent(false)}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddStudent(true)}>Relacionar Alumno</button>
          )}
        </div>
      )}

      {/* Oculta los elementos de búsqueda y filtrado si el rol es 'usuario' */}
      {rol !== 'usuario' && (
        <>
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
            <select name="estado" className="form-select mb-2" value={filters.estado} onChange={handleFilterChange}>
              <option value="todos">Mostrar todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>Buscar</button>
          </div>
        </>
      )}
      
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
