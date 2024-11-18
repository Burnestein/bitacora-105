// Dashboard.jsx

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../css/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ onLogout }) {
  const [currentView, setCurrentView] = useState('Inicio');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const userImage = localStorage.getItem('userImage') || "/default-user.jpg"; // Imagen de usuario o imagen predeterminada
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

  return (
    <div className="dashboard container-fluid">
      <div className='row'>
        <div className='col-12'>
          <Header onLogout={onLogout} userImage={userImage} nombreUsuario={nombreUsuario} />
        </div>
      </div>
      
      <div className="dashboard-body">
        <div className={`sidebar-container ${isSidebarExpanded ? 'expanded' : ''}`}>
          <Sidebar setView={setCurrentView} toggleSidebar={toggleSidebar} isExpanded={isSidebarExpanded} />
        </div>
        <div className="main-content-container">
          <MainContent view={currentView} setView={setCurrentView} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
