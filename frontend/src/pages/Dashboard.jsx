import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import { isAuthenticated, getToken } from '../Auth';
import ModalMedium from '../components/ModalMedium';
import axios from 'axios';
import config from '../../backend.config.json';
import { CardContainer } from '../components/CardStyles';
import PresentationCard from '../components/PresentationCard';
import styled from 'styled-components';

const NewPresentationButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
`;

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentationDescription, setPresentationDescription] = useState('');
  const [presentations, setPresentations] = useState([]);

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
      return alert('Presentation name is required.');
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
      const updatedPresentations = [...presentations, newPresentation];
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
    <div>
      <h2>Dashboard</h2>
      <Logout />
      <NewPresentationButton onClick={handleOpenModal}>New Presentation</NewPresentationButton>

      {isModalOpen && (
        <ModalMedium onClose={handleCloseModal}>
          <h3>Create a New Presentation</h3>
          <input
            type="text"
            value={presentationName}
            onChange={(e) => setPresentationName(e.target.value)}
            placeholder="Enter presentation name"
          />
          <input
            type="text"
            value={presentationDescription}
            onChange={(e) => setPresentationDescription(e.target.value)}
            placeholder="Enter description"
          />
          <button onClick={handleCreatePresentation}>Create</button>
        </ModalMedium>
      )}

      <div>
        <h3>Your Presentations</h3>
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
      </div>
    </div>
  );
}

export default Dashboard;
