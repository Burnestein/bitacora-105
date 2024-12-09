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
        if (!response.ok) throw new Error('Error al obtener datos del servidor');
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
          imagen: student.imagen || "/default-student.jpg",
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
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchFromServer();
  }, [apiUrl, userId, rol]);

  const handleDeleteRelation = async (codigoAlumno) => {
    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos/${codigoAlumno}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar relación con alumno.');

      setFilteredStudents((prev) => prev.filter((student) => student.codigo_alumno !== codigoAlumno));
      alert('Relación eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar relación con alumno:', error);
    }
  };

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
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async () => {
    if (!studentCode.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}/alumnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_alumno: studentCode }),
      });

      if (!response.ok) throw new Error('Error al agregar relación con alumno');
      setStudentCode('');
      setShowAddStudent(false);
      alert("Relación con alumno agregada exitosamente");
    } catch (error) {
      console.error("Error al agregar relación con alumno:", error);
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

      <div className="students-list-container">
        <ul className="students-list">
          {filteredStudents.map((student) => (
            <li key={student.id}>
              <button onClick={() => onStudentSelect(student.id)}>
                <img 
                  src={student.imagen} 
                  alt="Perfil" 
                  className="student-image" 
                  onError={(e) => {
                    e.target.src = "/default-user.jpg";
                  }}
                />
                <div className="student-info">
                  <span className="student-name">{`${student.apellido_paterno} ${student.apellido_materno}, ${student.nombre}`}</span>
                  <span className="student-details">{`${student.grado}° ${student.grupo} - ${student.turno}`}</span>
                </div>
              </button>
              {rol === 'usuario' && (
                <button 
                  className="btn btn-danger delete-relation-button" 
                  onClick={() => handleDeleteRelation(student.codigo_alumno)}
                >
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  );
}

export default StudentsList;
