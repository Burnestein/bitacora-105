import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'; // Importar addDoc y updateDoc
import { db } from '../firebase-config';  // Conectar con la base de datos Firestore

function AddStudentForm() {
  const [formData, setFormData] = useState({
    apellido_materno: '',
    apellido_paterno: '',
    asesor: '',
    grado: '',
    grupo: '',
    imagen: '',
    incidencias: '',
    nombre: '',
    turno: ''
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

  // Función para agregar el alumno a Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Indicador de carga
    try {
      // Primero agregamos el documento sin el campo 'id'
      const docRef = await addDoc(collection(db, 'alumnos'), formData);

      // Luego obtenemos el ID generado automáticamente por Firestore
      const idGenerado = docRef.id;

      // Actualizamos el documento con el campo 'id'
      const alumnoRef = doc(db, 'alumnos', idGenerado);
      await updateDoc(alumnoRef, {
        id: idGenerado
      });

      alert('Alumno agregado exitosamente');
      // Restablecemos el formulario
      setFormData({
        apellido_materno: '',
        apellido_paterno: '',
        asesor: '',
        grado: '',
        grupo: '',
        imagen: '',
        incidencias: '',
        nombre: '',
        turno: ''
      });
    } catch (error) {
      console.error('Error agregando el alumno: ', error);
      alert('Hubo un error al agregar el alumno');
    } finally {
      setLoading(false);  // Terminamos el indicador de carga
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
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          placeholder="Apellido Paterno"
          required
        />
        <input
          type="text"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          placeholder="Apellido Materno"
          required
        />

        {/* Campo limitado para Grado */}
        <select
          name="grado"
          value={formData.grado}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Seleccionar Grado</option>
          <option value="Primero">Primero</option>
          <option value="Segundo">Segundo</option>
          <option value="Tercero">Tercero</option>
        </select>

        {/* Campo limitado para Grupo */}
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

        {/* Campo limitado para Turno */}
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
          type="text"
          name="asesor"
          value={formData.asesor}
          onChange={handleChange}
          placeholder="Asesor"
          required
        />
        <input
          type="text"
          name="incidencias"
          value={formData.incidencias}
          onChange={handleChange}
          placeholder="Incidencias"
          required
        />
        <input
          type="text"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="URL Imagen"
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
