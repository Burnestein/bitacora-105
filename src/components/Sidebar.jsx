import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ setView, userImage, onLogout }) {
    // Lee el rol del usuario desde localStorage
    const userRole = localStorage.getItem('rol');
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token de sesión
        localStorage.removeItem('rol'); // Elimina el rol del usuario
        localStorage.removeItem('nombreUsuario'); // Elimina el nombre del usuario
        onLogout(); // Llama a la función onLogout para redirigir al inicio de sesión
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
                    <button className="btn btn-primary option-button" onClick={() => setView('Inicio')}>Inicio</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Lista de Alumnos')}>Lista de Alumnos</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Agregar Alumno')}>Agregar Alumno</button>
                    <button className="btn btn-primary option-button" onClick={() => setView('Agregar Usuario')}>Agregar Usuario</button>
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
                <button className="btn btn-danger logout-button" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
}

export default Sidebar;
