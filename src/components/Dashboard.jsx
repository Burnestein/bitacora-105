import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../css/Dashboard.css';

function Dashboard() {
  const [currentView, setCurrentView] = useState('Inicio');

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        <Sidebar setView={setCurrentView} />
        <MainContent view={currentView} />
      </div>
    </div>
  );
}

export default Dashboard;