import React, { useState, useContext } from 'react';
import { ConfigContext } from './ConfigContext'; // Asegúrate de importar el contexto

function AddTeacherForm() {
  const { apiUrl } = useContext(ConfigContext); // Obtiene apiUrl desde el contexto
  const [formData, setFormData] = useState({
    nombre: '',
    apepa: '',
    apemat: '',
    domicilio: '',
    correo: '',
    correod: '',
    telefono: '',
    telefonod: '',
    telefonot: '',
    contra: ''
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

  // Función para enviar el formulario a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/profesores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          telefono: parseInt(formData.telefono, 10),
          telefonod: parseInt(formData.telefonod, 10),
          telefonot: parseInt(formData.telefonot, 10),
          contra: parseInt(formData.contra, 10)
        })
      });

      if (!response.ok) throw new Error('Error al agregar el profesor');

      alert('Profesor agregado exitosamente');
      setFormData({
        nombre: '',
        apepa: '',
        apemat: '',
        domicilio: '',
        correo: '',
        correod: '',
        telefono: '',
        telefonod: '',
        telefonot: '',
        contra: ''
      });
    } catch (error) {
      console.error('Error agregando el profesor: ', error);
      alert('Hubo un error al agregar el profesor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-form">
      <h2>Agregar Nuevo Profesor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="apepa" value={formData.apepa} onChange={handleChange} placeholder="Apellido Paterno" required />
        <input type="text" name="apemat" value={formData.apemat} onChange={handleChange} placeholder="Apellido Materno" required />
        <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} placeholder="Domicilio" required />
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo" required />
        <input type="email" name="correod" value={formData.correod} onChange={handleChange} placeholder="Correo de emergencia" />
        <input type="number" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" required />
        <input type="number" name="telefonod" value={formData.telefonod} onChange={handleChange} placeholder="Teléfono de emergencia" />
        <input type="number" name="telefonot" value={formData.telefonot} onChange={handleChange} placeholder="Teléfono del Tutor" />
        <input type="password" name="contra" value={formData.contra} onChange={handleChange} placeholder="Contraseña" required />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Profesor'}
        </button>
      </form>
    </div>
  );
}

export default AddTeacherForm;
