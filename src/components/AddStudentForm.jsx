import React, { useState } from 'react';

const API_BASE_URL = 'http://18.119.213.232:3001';

function AddStudentForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apepa: '',
    apemat: '',
    domicilio: '',
    padre: '',
    parentezco: '',
    telefono: '',
    telefonod: '',
    grado: '',
    grupo: '',
    turno: '',
    telefonot: ''
  });

  const [loading, setLoading] = useState(false);

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para enviar el formulario a la API en AWS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/alumnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          grado: parseInt(formData.grado, 10),
          telefono: parseInt(formData.telefono, 10),
          telefonod: parseInt(formData.telefonod, 10),
          telefonot: parseInt(formData.telefonot, 10),
        })
      });

      if (!response.ok) throw new Error('Error al agregar el alumno');

      alert('Alumno agregado exitosamente');
      setFormData({
        nombre: '',
        apepa: '',
        apemat: '',
        domicilio: '',
        padre: '',
        parentezco: '',
        telefono: '',
        telefonod: '',
        grado: '',
        grupo: '',
        turno: '',
        telefonot: ''
      });
    } catch (error) {
      console.error('Error agregando el alumno: ', error);
      alert('Hubo un error al agregar el alumno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-form">
      <h2>Agregar Nuevo Alumno</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="text"
          name="apepa"
          value={formData.apepa}
          onChange={handleChange}
          placeholder="Apellido Paterno"
          required
        />
        <input
          type="text"
          name="apemat"
          value={formData.apemat}
          onChange={handleChange}
          placeholder="Apellido Materno"
          required
        />
        <input
          type="text"
          name="domicilio"
          value={formData.domicilio}
          onChange={handleChange}
          placeholder="Domicilio"
          required
        />
        <input
          type="text"
          name="padre"
          value={formData.padre}
          onChange={handleChange}
          placeholder="Padre"
          required
        />
        <select
          name="parentezco"
          value={formData.parentezco}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccionar Parentezco</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Tutor">Tutor</option>
        </select>
        <input
          type="number"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          required
        />
        <input
          type="number"
          name="telefonod"
          value={formData.telefonod}
          onChange={handleChange}
          placeholder="Teléfono de emergencia"
          required
        />
        <select
          name="grado"
          value={formData.grado}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccionar Grado</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <select
          name="grupo"
          value={formData.grupo}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccionar Grupo</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <select
          name="turno"
          value={formData.turno}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccionar Turno</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
        </select>
        <input
          type="number"
          name="telefonot"
          value={formData.telefonot}
          onChange={handleChange}
          placeholder="Teléfono del Tutor"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Alumno'}
        </button>
      </form>
    </div>
  );
}

export default AddStudentForm;
