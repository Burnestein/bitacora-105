import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Importar addDoc para agregar documentos a Firestore
import { db } from '../firebase-config';  // Conectar con la base de datos Firestore

function AddStudentForm() {
  const [formData, setFormData] = useState({
    apellido_materno: '',
    apellido_paterno: '',
    asesor: '',
    grado: '',
    grupo: '',
    id: '',
    imagen: '',
    incidencias: '',
    nombre: '',
    turno: ''
  });

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
    try {
      await addDoc(collection(db, 'alumnos'), formData);  // Agrega el documento a la colección 'alumnos'
      alert('Alumno agregado exitosamente');
      setFormData({
        apellido_materno: '',
        apellido_paterno: '',
        asesor: '',
        grado: '',
        grupo: '',
        id: '',
        imagen: '',
        incidencias: '',
        nombre: '',
        turno: ''
      });
    } catch (error) {
      console.error('Error agregando el alumno: ', error);
      alert('Hubo un error al agregar el alumno');
    }
  };

  return (
    <div className="add-student-form">
      <h2>Agregar Nuevo Alumno</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required />
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} placeholder="Apellido Paterno" required />
        <input type="text" name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} placeholder="Apellido Materno" required />
        <input type="text" name="grado" value={formData.grado} onChange={handleChange} placeholder="Grado" required />
        <input type="text" name="grupo" value={formData.grupo} onChange={handleChange} placeholder="Grupo" required />
        <input type="text" name="turno" value={formData.turno} onChange={handleChange} placeholder="Turno" required />
        <input type="text" name="asesor" value={formData.asesor} onChange={handleChange} placeholder="Asesor" required />
        <input type="text" name="incidencias" value={formData.incidencias} onChange={handleChange} placeholder="Incidencias" required />
        <input type="text" name="imagen" value={formData.imagen} onChange={handleChange} placeholder="URL Imagen" required />
        <button type="submit">Agregar Alumno</button>
      </form>
    </div>
  );
}

export default AddStudentForm;
