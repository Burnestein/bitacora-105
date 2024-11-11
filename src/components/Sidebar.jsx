import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ setView, userImage }) {
    // Lee el rol del usuario desde localStorage
    const userRole = localStorage.getItem('rol');

    return (
        <div className="sidebar">
            <img 
                src={userImage || "/default-user.jpg"} 
                alt="User Profile" 
                className="img-fluid rounded-circle user-image" 
            />
            <label className="user-name-label">Nombre del Usuario</label> {/* Label para el nombre del usuario */}

            {userRole === 'admin' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => setView('Inicio')}>Inicio</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Agregar Alumno')}>Agregar Alumno</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Lista de Profesores')}>Lista de Profesores</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Agregar Profesor')}>Agregar Profesor</button>
                </>
            )}

            {userRole === 'profesor' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => setView('Inicio')}>Inicio</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button>
                </>
            )}
            
            {userRole !== 'usuario' && (
                <>
                    <button className="btn btn-secondary option-button" onClick={() => setView('Configuración')}>Configuración</button>
                </>
            )}

            {userRole === 'usuario' && (
                <>
                <button className="btn btn-primary option-button" onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button> 
                </>
            )}

            <div className="col-auto">
                <button className="btn btn-danger logout-button">Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Sidebar;
