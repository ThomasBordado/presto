import { Link } from 'react-router-dom';
import styled from 'styled-components';
import backgroundImage from '../assets/LandingPage.jpg';

const Container = styled.div`
  margin: -8px;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #333333;
  color: white;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: #ffffff;
  margin: 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;

  a {
    font-family: Arial, sans-serif;
    color: #ffffff;
    text-decoration: none;
    font-size: 16px;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      text-decoration: underline;
    }
  }

  a.register {
    background-color: white;
    color: #333;
    padding: 8px 16px;
    font-weight: bold;
    border: 1px solid #ddd;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const PageText = styled.div`
  text-align: center;
  margin-top: 70px;
  color: #007bff;
  font-family: Arial, sans-serif;
  font-size: 30px;
`;

function LandingPage() {
  return (
    <Container>
      <Navbar>
        <Title>Presto</Title>
        <NavLinks>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register">Register</Link>
        </NavLinks>
      </Navbar>
      <PageText>
        <h2>Make Better Presentations</h2>
      </PageText>
    </Container>
  );
}

export default LandingPage;
