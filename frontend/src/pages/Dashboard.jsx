import { useState, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  background-color: #ebebeb;
  min-height: 100vh;
  padding: 0;
  margin: -8px;
`;

const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #333333;
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
  background-color: #0056b3;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004080;
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.5);
    outline: 2px solid #e0e0e0;
  }
`;

const PresentationSection = styled.main`
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
  margin: 24px 0 16px 0;
`;

const ModalTitle = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin: 0 0 20px 0;
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

const FileInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #0056b3;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004080;
  }

  &:focus {
    outline: 2px solid #ffffff;
  }
`;

const HiddenDescription = styled.p`
  visibility: hidden;
  position: absolute;
`;

function Dashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentationDescription, setPresentationDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
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
      const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const store = response.data.store;
      setPresentations(store.presentations || []);
      setThumbnail(store.thumbnail || '')
    } catch (error) {
      console.error('Error fetching data store:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setThumbnail(null);
  };

  const handleCreatePresentation = async (e) => {
    e.preventDefault();

    if (!presentationName.trim()) {
      return showError('Presentation name is required.');
    }

    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const background = {
      type: 'solid',
      color: '#ffffff',
      gradient: {
        start: '#ffffff',
        end: '#000000',
        direction: 'to right',
      },
      image: '',
    };

    let thumbnailURL = thumbnail;

    const newPresentation = {
      id: uuidv4(),
      name: presentationName,
      description: presentationDescription,
      thumbnail: thumbnailURL,
      default_background: background,
      slides: [{ id: uuidv4() }]
    };

    try {
      const updatedPresentations = [newPresentation, ...presentations];
      await axios.put(
        `${config.BACKEND_LOCAL}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPresentations(updatedPresentations);
      setPresentationName('');
      setPresentationDescription('');
      setThumbnail(null);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating data store:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
    }
  };

  const handleCardClick = (id) => {
    navigate(`/presentation/${id}`);
  };

  return (
    <Container>
      <ErrorDisplay aria-live="assertive" />

      <HeaderBar>
        <DashboardTitle>Dashboard</DashboardTitle>
        <Logout aria-label="Logout of Presto" />
      </HeaderBar>

      <ButtonContainer aria-label="New presentation creation">
        <NewPresentationButton onClick={handleOpenModal} aria-label="Create new presentation button">
          New Presentation
        </NewPresentationButton>
      </ButtonContainer>

      {isModalOpen && (
        <ModalMedium onClose={handleCloseModal} aria-labelledby="modal-title">
          <form onSubmit={handleCreatePresentation} aria-label='New presentation form'>
            <ModalTitle id="modal-title">Create a Presentation</ModalTitle>
            <FormLabel htmlFor="presentation-title">Title:</FormLabel>
            <InputField
              id="presentation-title"
              type="text"
              placeholder="Enter presentation name"
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              aria-required="true"
              aria-describedby="presentationTitleDesc"
            />
            <HiddenDescription id="presentationTitleDesc">Enter the presentation title</HiddenDescription>

            <FormLabel htmlFor="presentation-description">Description:</FormLabel>
            <InputField
              id="presentation-description"
              type="text"
              placeholder="Enter presentation description"
              value={presentationDescription}
              onChange={(e) => setPresentationDescription(e.target.value)}
              aria-describedby="presentationDescriptionDesc"
            />
            <HiddenDescription id="presentationDescriptionDesc">Enter the presentation description</HiddenDescription>

            <FormLabel htmlFor="presentation-thumbnail">Thumbnail:</FormLabel>
            <FileInput
              id="presentation-thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              aria-describedby="presentationThumbnailDesc"
            />
            <HiddenDescription id="presentationDescriptionDesc">Upload a thumbnail image for your presentation</HiddenDescription>

            <SubmitButton type="submit" aria-label="Create presentation button">Create</SubmitButton>
          </form>
        </ModalMedium>
      )}

      <PresentationSection aria-label="Your presentations">
        <PresentationHeading>Your Presentations</PresentationHeading>
        <CardContainer aria-label="Presentation cards">
          {presentations.map((presentation) => (
            <PresentationCard
              key={presentation.id}
              name={presentation.name}
              description={presentation.description}
              slideCount={presentation.slides.length}
              thumbnail={presentation.thumbnail}
              onClick={() => handleCardClick(presentation.id)}
              aria-label={`Open presentation: ${presentation.name}`}
            />
          ))}
        </CardContainer>
      </PresentationSection>
    </Container>
  );
}

export default Dashboard;
