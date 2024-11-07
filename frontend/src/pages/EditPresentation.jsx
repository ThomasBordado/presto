import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModalSmall from '../components/ModalSmall';
import ModalMedium from '../components/ModalMedium';
import axios from 'axios';
import { getToken } from '../Auth';
import config from '../../backend.config.json';
import SlideControl from '../components/SlideContol';
import SlideNumber from '../components/SlideNumber';
import SlideContainer from '../components/SlideContainer';
import ToolPanel from '../components/ToolPanel';
import styled from 'styled-components';

const Title = styled.h3`
  line-break: anywhere;
`;

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTitleEditModalOpen, setIsTitleEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const store = response.data.store;
        const presentations = store.presentations || [];

        const foundPresentation = presentations.find(
          (presentation) => presentation.id === parseInt(id, 10)
        );

        if (foundPresentation) {
          setPresentation(foundPresentation);
          setNewTitle(foundPresentation.name);
          setThumbnail(foundPresentation.thumbnail || '');
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations;

      const updatedPresentations = presentations.filter(
        (presentation) => presentation.id !== parseInt(id, 10)
      );

      await axios.put(
        `http://localhost:${config.BACKEND_PORT}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openTitleEditModal = () => {
    setIsTitleEditModalOpen(true);
  };

  const closeTitleEditModal = () => {
    setIsTitleEditModalOpen(false);
  };

  const handleTitleSave = async () => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const updatedPresentation = { ...presentation, name: newTitle };

      const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations || [];

      const updatedPresentations = presentations.map((pres) =>
        pres.id === parseInt(id, 10) ? updatedPresentation : pres
      );

      await axios.put(
        `http://localhost:${config.BACKEND_PORT}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPresentation(updatedPresentation);
      closeTitleEditModal();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const token = getToken();
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const updatedPresentation = { ...presentation, thumbnail: reader.result };

        const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const store = response.data.store;
        const presentations = store.presentations || [];

        const updatedPresentations = presentations.map((pres) =>
          pres.id === parseInt(id, 10) ? updatedPresentation : pres
        );

        await axios.put(
          `http://localhost:${config.BACKEND_PORT}/store`,
          { store: { presentations: updatedPresentations } },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPresentation(updatedPresentation);
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create slide
  const handleCreateSlide = async () => {
    const newSlide = {};
    const updatedSlides = [...presentation.slides, newSlide];
    await saveSlides(updatedSlides);
    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
    setCurrentSlideIndex(updatedSlides.length - 1);
  };

  // Delete slide
  const handleDeleteSlide = async () => {
    if (presentation.slides.length === 1) {
      // need to change alert
      alert('Cannot delete the only slide. Delete the presentation instead.');
      return;
    }
    const updatedSlides = presentation.slides.filter((_, index) => index !== currentSlideIndex);
    await saveSlides(updatedSlides);
    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const saveSlides = async (updatedSlides) => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const updatedPresentation = { ...presentation, slides: updatedSlides };

      const response = await axios.get(`http://localhost:${config.BACKEND_PORT}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations || [];

      const updatedPresentations = presentations.map((pres) =>
        pres.id === parseInt(id, 10) ? updatedPresentation : pres
      );

      await axios.put(
        `http://localhost:${config.BACKEND_PORT}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error saving slides:', error);
    }
  };

  const goToPreviousSlide = () => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  const goToNextSlide = () => setCurrentSlideIndex((prev) => Math.min(prev + 1, presentation.slides.length - 1));

  // Keyboard navigation of left and right arrow keys on slides
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goToPreviousSlide();
      if (event.key === 'ArrowRight') goToNextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, presentation?.slides.length]);

  return (
    <div>
      {presentation ? (
        <>
          <div>
            <Title>{presentation.name}</Title>
            <button onClick={openTitleEditModal}>Edit Title</button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {/* Code to show thumbnail {thumbnail && <img src={thumbnail} alt="Thumbnail" />} */}

          <button onClick={handleBack}>Back</button>
          <button onClick={openDeleteModal}>Delete Presentation</button>

          {isTitleEditModalOpen && (
            <ModalMedium onClose={closeTitleEditModal}>
              <h3>Edit Title</h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new title"
              />
              <button onClick={handleTitleSave}>Save</button>
            </ModalMedium>
          )}

          {isDeleteModalOpen && (
            <ModalSmall onClose={closeDeleteModal}>
              <p>Are you sure?</p>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={closeDeleteModal}>No</button>
            </ModalSmall>
          )}

          <SlideControl
            currentSlideIndex={currentSlideIndex}
            totalSlides={presentation.slides.length}
            goToPreviousSlide={goToPreviousSlide}
            goToNextSlide={goToNextSlide}
            handleCreateSlide={handleCreateSlide}
            handleDeleteSlide={handleDeleteSlide}
          />
          <ToolPanel />
          <SlideContainer>
            <SlideNumber currentSlideIndex={currentSlideIndex} />
          </SlideContainer>
        </>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
