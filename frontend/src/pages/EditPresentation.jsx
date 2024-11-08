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
import AddTextModal from '../components/AddTextModal';
import EditTextModal from '../components/EditTextModal';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import styled from 'styled-components';
import TextBox from '../components/TextBox';
import AddImageModal from '../components/AddImageModal';
import StyledImage from '../components/StyledImage';

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
  const [isAddTextModalOpen, setIsAddTextModalOpen] = useState(false);
  const [isEditTextModalOpen, setIsEditTextModalOpen] = useState(false);
  const [editingTextBoxIndex, setEditingTextBoxIndex] = useState(null);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const { showError, ErrorDisplay } = useErrorMessage();
  
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
      showError('Cannot delete the only slide. Delete the presentation instead.');
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
  const isAnyModalOpen = isDeleteModalOpen || isTitleEditModalOpen || isAddTextModalOpen || isEditTextModalOpen || isAddImageModalOpen;
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isAnyModalOpen) {
        if (event.key === 'ArrowLeft') goToPreviousSlide();
        if (event.key === 'ArrowRight') goToNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, presentation?.slides.length, isAnyModalOpen]);

  const openAddTextModal = () => setIsAddTextModalOpen(true);
  const closeAddTextModal = () => setIsAddTextModalOpen(false);

  const openEditTextModal = (index) => {
    setEditingTextBoxIndex(index);
    setIsEditTextModalOpen(true);
  };
  const closeEditTextModal = () => {
    setIsEditTextModalOpen(false);
    setEditingTextBoxIndex(null);
  };

  const handleSaveTextBox = async (textBox) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];


    let updatedTextBoxes = null;
    if (editingTextBoxIndex !== null) {
      updatedTextBoxes = textBoxes.map((box, i) => (i === editingTextBoxIndex ? textBox : box));
    } else {
      const highestZIndex = Math.max(
        ...(textBoxes).map((box) => box.zIndex || 0),
        ...(images).map((img) => img.zIndex || 0),
        0
      );
      const newTextBox = { ...textBox, zIndex: highestZIndex + 1 };
      updatedTextBoxes = [...textBoxes, newTextBox];
    }

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      textBoxes: updatedTextBoxes,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    closeEditTextModal();
  };

  const handleDeleteTextBox = async (index) => {
    const updatedSlides = [...presentation.slides];
    const updatedTextBoxes = updatedSlides[currentSlideIndex].textBoxes.filter((_, i) => i !== index);

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      textBoxes: updatedTextBoxes,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
  };

  const openAddImageModal = () => setIsAddImageModalOpen(true);
  const closeAddImageModal = () => {
    setIsAddImageModalOpen(false);
    setEditingImageIndex(null);
  };

  const openEditImageModal = (index) => {
    setEditingImageIndex(index);
    setIsAddImageModalOpen(true);
  };

  const handleSaveImage = async (imageData) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];


    let updatedImages = null;
    if (editingImageIndex !== null) {
      updatedImages = images.map((img, i) => 
        i === editingImageIndex
          ? { ...imageData, zIndex: img.zIndex ?? imageData.zIndex }
          : img
      );
    } else {
      const highestZIndex = Math.max(
        ...(textBoxes).map((box) => box.zIndex || 0),
        ...(images).map((img) => img.zIndex || 0),
        0
      );
      const newImageData = { ...imageData, zIndex: highestZIndex + 1 };
      updatedImages = [...images, newImageData];
    }

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      images: updatedImages,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    closeAddImageModal();
  };

  const handleDeleteImage = async (index) => {
    const updatedSlides = [...presentation.slides];
    const updatedImages = updatedSlides[currentSlideIndex].images.filter((_, i) => i !== index);

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      images: updatedImages,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
  };

  return (
    <div>
      <ErrorDisplay />
      {presentation ? (
        <div>
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
          <ToolPanel onAddText={openAddTextModal} onAddImage={openAddImageModal} />

          <AddTextModal
            isOpen={isAddTextModalOpen}
            onClose={closeAddTextModal}
            onSave={handleSaveTextBox}
          />
          <EditTextModal
            isOpen={isEditTextModalOpen}
            onClose={closeEditTextModal}
            onSave={handleSaveTextBox}
            textBox={
              editingTextBoxIndex !== null
                ? presentation.slides[currentSlideIndex].textBoxes[editingTextBoxIndex]
                : null
            }
          />
          <AddImageModal
            isOpen={isAddImageModalOpen}
            onClose={closeAddImageModal}
            onSave={handleSaveImage}
            image={
              editingImageIndex !== null
                ? presentation.slides[currentSlideIndex].images[editingImageIndex]
                : null
            }
          />
          <SlideContainer>
            {presentation.slides[currentSlideIndex]?.images?.map((img, index) => (
              <StyledImage
                key={index}
                src={img.src}
                alt={img.description}
                $size={img.size}
                $position={img.position || { x: 0, y: 0 }}
                $zIndex={img.zIndex}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteImage(index);
                }}
                onDoubleClick={() => openEditImageModal(index)}
              />
            ))}
            {presentation.slides[currentSlideIndex]?.textBoxes?.map((box, index) => (
              <TextBox
                key={index}
                $size={box.size}
                $fontSize={box.fontSize}
                $color={box.color}
                $position={box.position || { x: 0, y: 0 }}
                $zIndex={box.zIndex}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleDeleteTextBox(index);
                }}
                onDoubleClick={() => openEditTextModal(index)}
              >
                {box.text}
              </TextBox>
            ))}
            <SlideNumber currentSlideIndex={currentSlideIndex} />
          </SlideContainer>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </div>
  );
};

export default EditPresentation;
