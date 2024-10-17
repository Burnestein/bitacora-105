import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ setView, userImage }) {
    return (
        <div className="sidebar">
        <img 
                src={userImage || "/default-user.jpg"} 
                alt="User Profile" 
                className="img-fluid rounded-circle user-image" 
            />
        <button onClick={() => setView('Inicio')}>Inicio</button>
        <button onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button>
        <button onClick={() => setView('Agregar Alumno')}>Agregar Alumno</button>
      </div>
    );
  }

export default Sidebar;
