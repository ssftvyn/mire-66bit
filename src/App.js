import Login from './pages/Login';
import ProfileClient from './pages/ProfileClient';
import ProfileManager from './pages/ProfileManager';
import Plistu from './pages/View projects user';
import Plistm from './pages/View projects manager';
import ProjectCreate from './pages/ProjectCreate';
import TaskTableC from './pages/TaskTableC';
import TaskTableM from './pages/TaskTableM';
import TaslInfo from './pages/TaskInfoC';
import Report from './pages/Report';
import Clients from './pages/ClientsList';
import Managers from './pages/ManagersList';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsAuthenticated(token != null);
    setRole(userRole);
    localStorage.setItem('lastPath', location.pathname);
  }, [role, location]);

  return (
    <>
    <div className='container'>
      <Routes>
        <Route path="/" element={<Login />} />
          <>
          {isAuthenticated && role === 'CLIENT' && (
  <>
    <Route path="/ClientProfile" element={<ProfileClient />} />
    <Route path="/ProjectListClient" element={<Plistu />} />
    <Route path="/TaskTableClient/:projectId" element={<TaskTableC />} />
    <Route path="/TaskInfoClient/:id" element={<TaslInfo />} />
    <Route path="/Report" element={<Report />} />
    <Route path="/*" element={<ProfileClient />} />
  </>
)}
{isAuthenticated && role === 'MANAGER' && (
  <>
    <Route path="/ManagerProfile" element={<ProfileManager />} />
    <Route path="/ProjectListManager" element={<Plistm />} />
    <Route path="/projectcreate" element={<ProjectCreate />} />
    <Route path="/TaskTableManager/:projectId" element={<TaskTableM />} />
    <Route path="/Clients" element={<Clients />} />
    <Route path="/*" element={<ProfileManager />} />
  </>
)}
{isAuthenticated && role === 'ADMIN' && (
  <>
    <Route path="/Managers" element={<Managers />} />
    <Route path="/*" element={<Managers />} />
  </>
)}
          </>
      </Routes>
    </div>
    <Footer />
    </>
  );
}

export default App;

