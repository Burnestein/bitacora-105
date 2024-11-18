import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ setView, userImage, onLogout }) {
    const userRole = localStorage.getItem('rol');
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    const handleViewChange = (newView) => {
        setView(''); // Primero, resetea la vista actual
        setTimeout(() => setView(newView), 0); // Luego, establece la nueva vista
    };

    return (
        <div className="sidebar">
            <img 
                src={userImage || "/default-user.jpg"} 
                alt="User Profile" 
                className="img-fluid rounded-circle user-image" 
            />
            <label className="user-name-label">{nombreUsuario || 'Nombre del Usuario'}</label>

            {userRole === 'admin' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Inicio')}>Inicio</button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>Lista de Alumnos</button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Agregar Alumno')}>Agregar Alumno</button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Usuarios')}>Lista de Usuarios</button>

                </>
            )}

            {userRole === 'profesor' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Inicio')}>Inicio</button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>Lista de Alumnos</button>
                </>
            )}

            {userRole !== 'usuario' && (
                <>
                    
                </>
            )}

            {userRole === 'usuario' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>Lista de Alumnos</button> 
                    <button className="btn btn-secondary option-button" onClick={() => handleViewChange('Configuración')}>Configuración</button>
                </>
            )}

            <div className="col-auto">
                <button className="btn btn-danger logout-button" onClick={onLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Sidebar;
