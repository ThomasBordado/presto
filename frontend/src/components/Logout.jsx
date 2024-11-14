import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';
import { getToken, removeToken } from '../Auth';
import styled from 'styled-components';

const LogoutButton = styled.button`
  font-family: Arial, sans-serif;
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
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
      console.error('Error logging out:', error.response.data.error);
    }
  };

  return <LogoutButton onClick={handleLogout}>Logout</LogoutButton>;
}

export default Logout;
