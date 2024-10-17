import React from 'react';
import '../css/Header.css';

function Header() {
  return (
    <div className="header row align-items-center">
      <div className="col text-center text-md-left">
        <h1>Bitácora Secundaria 105</h1>
      </div>
      <div className="col-auto">
        <button className="btn btn-primary">Iniciar Sesión</button>
      </div>
    </div>
  );
}

export default Header;
