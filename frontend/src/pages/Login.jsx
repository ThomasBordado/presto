import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import config from '../../backend.config.json';
import { setToken } from '../Auth';
import { useErrorMessage } from '../hooks/UseErrorMessage';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showError, ErrorDisplay } = useErrorMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:${config.BACKEND_PORT}/admin/auth/login`, { email, password });
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      showError(error.response.data.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <ErrorDisplay />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
        </label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>
          Password:
        </label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
