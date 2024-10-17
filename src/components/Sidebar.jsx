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
            <button className="btn btn-primary option-button" onClick={() => setView('Inicio')}>Inicio</button>
            <button className="btn btn-primary option-button" onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button>
            <button className="btn btn-primary option-button" onClick={() => setView('Agregar Alumno')}>Agregar Alumno</button>
            
            <div className="col-auto">
            <button className="btn btn-danger logout-button">Cerrar Sesion</button>
            </div>
      </div>
    );
  }

export default Sidebar;
