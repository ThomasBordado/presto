import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import { isAuthenticated } from '../Auth';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      <Logout />
    </div>
  );
}

export default Dashboard;
