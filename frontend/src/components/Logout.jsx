import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';
import { getToken, removeToken } from '../Auth';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`http://localhost:${config.BACKEND_PORT}/admin/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      removeToken();
      navigate('/');
    } catch (error) {
      alert(error.response.data.error || 'Logout failed.');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
