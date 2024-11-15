import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';
import { getToken, removeToken } from '../Auth';
import styled from 'styled-components';

const LogoutButton = styled.option`
  font-family: Arial, sans-serif;
  background-color: #b22222;
  color: #ffffff;
  padding: 8px 21px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8B1A1A;
  }

  &:focus {
    outline: 2px solid white;
  }
`;

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(`${config.BACKEND_LOCAL}/admin/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      removeToken();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return <LogoutButton aria-label="Logout of Presto" onClick={handleLogout}>Logout</LogoutButton>;
}

export default Logout;
