import React from 'react';
import '../css/Header.css';

function Header({ onLogout, userImage, nombreUsuario }) {
  return (
    <div className="header row align-items-center justify-content-between">
      <div className="col text-center text-md-left">
        <h1 className='titulo'>
          Sistema de Incidencias Escolares
        </h1>
      </div>
      <div className="col-auto d-flex align-items-center">
        <img src={userImage} alt="User Profile" className="img-fluid rounded-circle header-user-image" />
        <span className="user-name">{nombreUsuario}</span>
        <button className="btn btn-danger logout-button" onClick={onLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Header;
