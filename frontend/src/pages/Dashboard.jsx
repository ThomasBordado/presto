import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import { isAuthenticated, getToken } from '../Auth';
import ModalMedium from '../components/ModalMedium';
import axios from 'axios';
import config from '../../backend.config.json';
import { CardContainer } from '../components/CardStyles';
import PresentationCard from '../components/PresentationCard';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #ebebeb;
  min-height: 100vh;
  padding: 0;
  margin: -8px;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;

const DashboardTitle = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: #ebebeb;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 36px;
`;

const NewPresentationButton = styled.button`
  width: 100%;
  max-width: 1367px;
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
`;

const PresentationSection = styled.div`
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 20px;
  text-align: left;
  font-family: Arial, sans-serif;
`;

const PresentationHeading = styled.h3`
  color: #333333;
  font-family: Arial, sans-serif;
  font-size: 24px;
  text-indent: 16px;
`;

const ModalTitle = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
  text-align: center;
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
`;

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentationDescription, setPresentationDescription] = useState('');
  const [presentations, setPresentations] = useState([]);
  const { showError, ErrorDisplay } = useErrorMessage();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      fetchDataStore();
    }
  }, [navigate]);

  const fetchDataStore = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const store = response.data.store;
      setPresentations(store.presentations || []);
    } catch (error) {
      console.error('Error fetching data store:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePresentation = async () => {
    if (!presentationName.trim()) {
      return showError('Presentation name is required.');
    }

    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const newPresentation = {
      id: Date.now(),
      name: presentationName,
      description: presentationDescription,
      thumbnail: null,
      slides: [{}]
    };

    try {
      const updatedPresentations = [newPresentation, ...presentations];
      await axios.put(
        `http://localhost:${config.BACKEND_PORT}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPresentations(updatedPresentations);
      setPresentationName('');
      setPresentationDescription('');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating data store:', error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/presentation/${id}`);
  };

  return (
    <Container>
      <HeaderBar>
        <DashboardTitle>Dashboard</DashboardTitle>
        <Logout />
      </HeaderBar>
      <ErrorDisplay />
      <ButtonContainer>
        <NewPresentationButton onClick={handleOpenModal}>New Presentation</NewPresentationButton>
      </ButtonContainer>

      {isModalOpen && (
        <ModalMedium onClose={handleCloseModal}>
          <ModalTitle>Create a Presentation</ModalTitle>
          <FormLabel>Title:</FormLabel>
          <InputField
            type="text"
            value={presentationName}
            onChange={(e) => setPresentationName(e.target.value)}
            placeholder="Enter presentation name"
          />
          <FormLabel>Description:</FormLabel>
          <InputField
            type="text"
            value={presentationDescription}
            onChange={(e) => setPresentationDescription(e.target.value)}
            placeholder="Enter description"
          />
          <SubmitButton onClick={handleCreatePresentation}>Create</SubmitButton>
        </ModalMedium>
      )}

      <PresentationSection>
        <PresentationHeading>Your Presentations</PresentationHeading>
        <CardContainer>
          {presentations.map((presentation) => (
            <PresentationCard
              key={presentation.id}
              name={presentation.name}
              description={presentation.description}
              slideCount={presentation.slides.length}
              thumbnail={presentation.thumbnail}
              onClick={() => handleCardClick(presentation.id)}
            />
          ))}
        </CardContainer>
      </PresentationSection>
    </Container>
  );
}

export default Dashboard;
