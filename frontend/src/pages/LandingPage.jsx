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
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const Header = styled.header`
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

const NavLinks = styled.nav`
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

    &:focus {
      outline: 2px solid #ffffff;
    }
  }

  .register {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:focus {
      outline: 2px solid #333;
    }
  }
`;

const MainContent = styled.main`
  text-align: center;
  margin-top: 70px;
  color: #007bff;
  font-family: Arial, sans-serif;
  font-size: 30px;
`;

function LandingPage() {
  return (
    <Container aria-label="Landing page with login and register options">
      <Header>
        <Title>Presto</Title>
        <NavLinks aria-label="Primary navigation">
          <Link to="/login" aria-label="Login to Presto">Login</Link>
          <Link name="register-button" to="/register" className="register" aria-label="Register for Presto">Register</Link>
        </NavLinks>
      </Header>
      <MainContent>
        <h2>Make Better Presentations</h2>
      </MainContent>
    </Container>
  );
}

export default LandingPage;
