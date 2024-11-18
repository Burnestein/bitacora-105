import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../css/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ onLogout }) {  // Recibe onLogout como prop
  const [currentView, setCurrentView] = useState('Inicio');

  return (
    <div className="dashboard container-fluid">
      <div className='row'>
        <div className='col-12'>
          <Header />
        </div>
      </div>
      
      <div className="dashboard-body row" style={{ height: 'calc(100vh - 56px)' }}>
        <div className='col-12 col-md-3 sidebar-container'>
          <Sidebar setView={setCurrentView} onLogout={onLogout} />  {/* Pasa onLogout a Sidebar */}
        </div>
        <div className='col-12 col-md-9 main-content-container'>
          <MainContent view={currentView} setView={setCurrentView} />  {/* Pasa setView a MainContent */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
