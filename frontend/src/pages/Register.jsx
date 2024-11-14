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

const RegisterBox = styled.main`
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

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showError, ErrorDisplay } = useErrorMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return showError('Passwords do not match. Please re-enter your password and try again.');
    }

    try {
      const response = await axios.post(`${config.BACKEND_LOCAL}/admin/auth/register`, { email, password, name });
      setToken(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      showError(error.response.data.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container>
      <RegisterBox>
        <FormTitle>Register</FormTitle>
        <ErrorDisplay aria-live="assertive" />
        <form onSubmit={handleSubmit} aria-label="Registration form">
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

          <FormLabel htmlFor="name">Name:</FormLabel>
          <InputField
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-required="true"
            aria-describedby="nameDesc"
            autoComplete="name"
          />
          <HiddenDescription id="nameDesc">Enter your full name</HiddenDescription>

          <FormLabel htmlFor="password">Password:</FormLabel>
          <InputField
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-describedby="passwordDesc"
            autoComplete="new-password"
          />
          <HiddenDescription id="passwordDesc">Enter a strong password</HiddenDescription>

          <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
          <InputField
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-required="true"
            aria-describedby="confirmPasswordDesc"
            autoComplete="new-password"
          />
          <HiddenDescription id="confirmPasswordDesc">Re-enter your password to confirm</HiddenDescription>

          <SubmitButton type="submit" aria-label="Register button">Register</SubmitButton>
        </form>
        <FooterText>
          Already have an account? <Link to="/login">Login</Link>
        </FooterText>
      </RegisterBox>
    </Container>
  );
}

export default Register;
