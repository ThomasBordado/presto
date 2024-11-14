import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import config from '../../backend.config.json';
import { setToken } from '../Auth';
import { useErrorMessage } from '../hooks/UseErrorMessage';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin: -8px;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;

const LoginBox = styled.main`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 8px;
  width: 320px;
  text-align: center;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  font-family: Arial, sans-serif;
  color: #333;
  font-weight: bold;
  display: block;
  margin-top: 15px;
  text-align: left;
`;

const InputField = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: 2px solid #0056b3;
  }
`;

const HiddenDescription = styled.p`
  visibility: hidden;
  position: absolute;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: 2px solid #0056b3;
  }
`;

const FooterText = styled.p`
  margin-top: 15px;
  color: #333;
  font-family: Arial, sans-serif;

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showError, ErrorDisplay } = useErrorMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.BACKEND_LOCAL}/admin/auth/login`, { email, password });
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      showError(error.response.data.error || 'Login failed. Please try again.');
    }
  };

  return (
    <Container>
      <LoginBox>
        <FormTitle>Login</FormTitle>
        <ErrorDisplay aria-live="assertive" />
        <form onSubmit={handleSubmit} aria-label="Login form">
          <FormLabel htmlFor="email">Email:</FormLabel>
          <InputField
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            aria-describedby="emailDesc"
            autoComplete="email"
          />
          <HiddenDescription id="emailDesc">Enter your email address</HiddenDescription>

          <FormLabel htmlFor="password">Password:</FormLabel>
          <InputField
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-describedby="passwordDesc"
            autoComplete="current-password"
          />
          <HiddenDescription id="passwordDesc">Enter your password</HiddenDescription>

          <SubmitButton type="submit" aria-label="Login button">Login</SubmitButton>
        </form>
        <FooterText>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </FooterText>
      </LoginBox>
    </Container>
  );
}

export default Login;
