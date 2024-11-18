import React from 'react';
import '../css/Sidebar.css';

function Sidebar({ setView, userImage, toggleSidebar, isExpanded }) {
    const userRole = localStorage.getItem('rol');
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    const handleViewChange = (newView) => {
        setView(''); 
        setTimeout(() => setView(newView), 0);
    };

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isExpanded ? '<' : '>'}
            </button>
            <img 
                src={userImage || "/default-user.jpg"} 
                alt="User Profile" 
                className="img-fluid rounded-circle user-image" 
            />
            <label className="user-name-label">{nombreUsuario || 'Nombre del Usuario'}</label>

            {userRole === 'admin' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Inicio')}>
                        <span className="option-icon" role="img" aria-label="Inicio">🏠</span>
                        <span className="option-text">Inicio</span>
                    </button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>
                        <span className="option-icon" role="img" aria-label="Lista de Alumnos">📋</span>
                        <span className="option-text">Lista de Alumnos</span>
                    </button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Agregar Alumno')}>
                        <span className="option-icon" role="img" aria-label="Agregar Alumno">➕</span>
                        <span className="option-text">Agregar Alumno</span>
                    </button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Usuarios')}>
                        <span className="option-icon" role="img" aria-label="Lista de Usuarios">👥</span>
                        <span className="option-text">Lista de Usuarios</span>
                    </button>
                </>
            )}

            {userRole === 'profesor' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Inicio')}>
                        <span className="option-icon" role="img" aria-label="Inicio">🏠</span>
                        <span className="option-text">Inicio</span>
                    </button>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>
                        <span className="option-icon" role="img" aria-label="Lista de Alumnos">📋</span>
                        <span className="option-text">Lista de Alumnos</span>
                    </button>
                </>
            )}

            {userRole === 'usuario' && (
                <>
                    <button className="btn btn-primary option-button" onClick={() => handleViewChange('Lista de Alumnos')}>
                        <span className="option-icon" role="img" aria-label="Lista de Alumnos">📋</span>
                        <span className="option-text">Lista de Alumnos</span>
                    </button>
                    <button className="btn btn-secondary option-button" onClick={() => handleViewChange('Configuración')}>
                        <span className="option-icon" role="img" aria-label="Configuración">⚙️</span>
                        <span className="option-text">Configuración</span>
                    </button>
                </>
            )}
        </div>
    );
}

export default Sidebar;
