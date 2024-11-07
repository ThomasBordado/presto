import React from 'react';
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
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  position: relative;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-family: Arial, sans-serif;
`;

const NavLinks = styled.div`
  a {
    color: white;
    text-decoration: none;
    margin-left: 15px;
    font-family: Arial, sans-serif;
    font-size: 15px;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const PageText = styled.div`
  text-align: center;
  margin-top: 70px;
  color: black;
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
          <Link to="/register">Register</Link>
        </NavLinks>
      </Navbar>
      <PageText>
        <h2>Make Better Presentations</h2>
      </PageText>
    </Container>
  );
}

export default LandingPage;
