import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
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
import Logout from '../components/Logout';
import StyledImage from '../components/StyledImage';
import AddVideoModal from '../components/AddVideoModal';
import StyledVideo from '../components/StyledVideo'
import BackgroundPickerModal from '../components/BackgroundModalPicker';

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

const PresentationTitle = styled.h1`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: #ebebeb;
  margin: 0;
  line-break: anywhere;
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #ebebeb;
  font-size: 18px;
  margin-top: 5px;
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    color: #bababa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  font-family: Arial, sans-serif;
  background-color: transparent;
  color: #2196f3;
  border: 2px solid #2196f3;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2196f3;
    color: white;
  }
`;

const DeleteButton = styled.button`
  background-color: transparent;
  color: #f44336;
  margin-right: 10px;
  border: 2px solid #f44336;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #f44336;
    color: white;
  }
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

const ThumbnailField = styled.input`
  width: 100%;
  padding: 8px 8px 8px 1px;
  margin-top: 5px;
`;

const SaveButton = styled.button`
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

const ModalText = styled.p`
  font-family: Arial, sans-serif;
  font-size: 16px;
  margin: 0 0 20px 0;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  font-family: Arial, sans-serif;
  width: 100px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2196f3;
  }
`;

const CancelButton = styled.button`
  font-family: Arial, sans-serif;
  width: 100px;
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #f6656c;
  }
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
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [isAnyModalOpen, setModalOpen] = useState(false);
  const { showError, ErrorDisplay } = useErrorMessage();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [defaultBackground, setDefaultBackground] = useState({ type: 'solid', value: '#ffffff' });
  const [currentSlideBackground, setCurrentSlideBackground] = useState({});

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
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setModalOpen(false);
  };

  const openTitleEditModal = () => {
    setIsTitleEditModalOpen(true);
    setModalOpen(true);
  };

  const closeTitleEditModal = () => {
    setIsTitleEditModalOpen(false);
    setModalOpen(false);
  };

  const handleSaveBackground = (background) => {
    setCurrentSlideBackground((prevState) => ({
      ...prevState,
      [currentSlideIndex]: background,
    }));
  };

  const handleSaveDefaultBackground = (background) => {
    setDefaultBackground(background);
  };

  const applyBackgroundStyle = (background) => {
    if (background.type === 'solid') {
      return { backgroundColor: background.color };
    } else if (background.type === 'gradient') {
      return {
        backgroundImage: `linear-gradient(${background.gradient.direction}, ${background.gradient.start}, ${background.gradient.end})`,
      };
    } else if (background.type === 'image') {
      return {
        backgroundImage: `url(${background.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  const handleTitleSave = async () => {
    if (!newTitle.trim()) {
      showError('Title cannot be empty.');
      return;
    }

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

  const openAddTextModal = () => {
    setIsAddTextModalOpen(true);
    setModalOpen(true);
  }
  const closeAddTextModal = () => {
    setIsAddTextModalOpen(false);
    setModalOpen(false);
  }

  const openEditTextModal = (id) => {
    setEditingTextBoxIndex(id);
    setIsEditTextModalOpen(true);
    setModalOpen(true);
  };
  const closeEditTextModal = () => {
    setIsEditTextModalOpen(false);
    setEditingTextBoxIndex(null);
    setModalOpen(false);
  };

  const handleSaveTextBox = async (textBox) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];
    const videos = updatedSlides[currentSlideIndex].videos || [];

    let updatedTextBoxes;

    if (editingTextBoxIndex) {
      updatedTextBoxes = textBoxes.map((box) => (box.id === editingTextBoxIndex ? textBox : box));
    } else {
      const highestZIndex = Math.max(
        ...textBoxes.map((box) => box.zIndex || 0),
        ...images.map((img) => img.zIndex || 0),
        ...videos.map((vid) => vid.zIndex || 0),
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

  const handleDeleteTextBox = async (id) => {
    const updatedSlides = [...presentation.slides];

    const updatedTextBoxes = updatedSlides[currentSlideIndex].textBoxes.filter((box) => box.id !== id);

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

  const openAddImageModal = () => {
    setIsAddImageModalOpen(true);
    setModalOpen(true);
  }
  const closeAddImageModal = () => {
    setIsAddImageModalOpen(false);
    setEditingImageIndex(null);
    setModalOpen(false);
  };

  const openEditImageModal = (id) => {
    setEditingImageIndex(id);
    setIsAddImageModalOpen(true);
    setModalOpen(true);
  };

  const handleSaveImage = async (imageData) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];
    const videos = updatedSlides[currentSlideIndex].videos || [];


    let updatedImages = null;
    if (editingImageIndex) {
      updatedImages = images.map((img) =>
        (img.id === editingImageIndex)
          ? { ...imageData, zIndex: img.zIndex ?? imageData.zIndex }
          : img
      );
    } else {
      const highestZIndex = Math.max(
        ...(textBoxes).map((box) => box.zIndex || 0),
        ...(images).map((img) => img.zIndex || 0),
        ...(videos).map((vid) => vid.zIndex || 0),
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

  const handleDeleteImage = async (id) => {
    const updatedSlides = [...presentation.slides];
    const updatedImages = updatedSlides[currentSlideIndex].images.filter((img) => img.id !== id);

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

  const openAddVideoModal = () => {
    setEditingVideoIndex(null);
    setIsAddVideoModalOpen(true);
    setModalOpen(true);
  };

  const closeAddVideoModal = () => {
    setIsAddVideoModalOpen(false);
    setEditingVideoIndex(null);
    setModalOpen(false);
  };

  const openEditVideoModal = (id) => {
    setEditingVideoIndex(id);
    setIsAddVideoModalOpen(true);
    setModalOpen(true);
  };

  const handleSaveVideo = async (videoData) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];
    const videos = updatedSlides[currentSlideIndex].videos || [];
    console.log(videoData);
    let updatedVideos = null;
    if (editingVideoIndex) {
      updatedVideos = videos.map((vid) =>
        (vid.id === editingVideoIndex)
          ? { ...videoData, zIndex: vid.zIndex ?? videoData.zIndex }
          : vid
      );
    } else {
      const highestZIndex = Math.max(
        ...(textBoxes).map((box) => box.zIndex || 0),
        ...(images).map((img) => img.zIndex || 0),
        ...(videos).map((vid) => vid.zIndex || 0),
        0
      );
      const newVideoData = { ...videoData, zIndex: highestZIndex + 1 };
      updatedVideos = [...videos, newVideoData];
    }

    updatedSlides[currentSlideIndex] = { ...updatedSlides[currentSlideIndex], videos: updatedVideos };
    await saveSlides(updatedSlides);

    setPresentation((prev) => ({ ...prev, slides: updatedSlides }));
    closeAddVideoModal();
  };

  const handleDeleteVideo = async (id) => {
    const updatedSlides = [...presentation.slides];
    const updatedVideos = updatedSlides[currentSlideIndex].videos.filter((vid) => vid.id !== id);

    updatedSlides[currentSlideIndex] = { ...updatedSlides[currentSlideIndex], videos: updatedVideos };
    await saveSlides(updatedSlides);

    setPresentation((prev) => ({ ...prev, slides: updatedSlides }));
  };

  const updateTextBox = async (id, updatedProps) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes;

    const updatedTextBoxes = textBoxes.map((box) =>
      box.id === id ? { ...box, ...updatedProps } : box
    );

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

  const updateImage = async (id, updatedProps) => {
    const updatedSlides = [...presentation.slides];
    const images = updatedSlides[currentSlideIndex].images;

    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, ...updatedProps } : img
    );

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

  const updateVideo = async (id, updatedProps) => {
    const updatedSlides = [...presentation.slides];
    const videos = updatedSlides[currentSlideIndex].videos;

    const updatedVideos = videos.map((vid) =>
      vid.id === id ? { ...vid, ...updatedProps } : vid
    );

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      videos: updatedVideos,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
  };

  return (
    <Container>
      <ErrorDisplay />
      {presentation ? (
        <div>
          <HeaderBar>
            <PresentationTitle>
              {presentation.name}
              <IconButton onClick={openTitleEditModal}>
                <FaEdit />
              </IconButton>
            </PresentationTitle>
            <ButtonGroup>
              <BackButton onClick={handleBack}>
                Back
              </BackButton>
              <DeleteButton onClick={openDeleteModal}>
                Delete Presentation
              </DeleteButton>
              <Logout />
            </ButtonGroup>
          </HeaderBar>
          {/* Code to show thumbnail {thumbnail && <img src={thumbnail} alt="Thumbnail" />} */}

          {isTitleEditModalOpen && (
            <ModalMedium onClose={closeTitleEditModal}>
              <ModalTitle>Edit Presentation Details</ModalTitle>
              <FormLabel>Title:</FormLabel>
              <InputField
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter presentation name"
              />
              <FormLabel>Thumbnail:</FormLabel>
              <ThumbnailField
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <SaveButton onClick={handleTitleSave}>Save</SaveButton>
            </ModalMedium>
          )}

          {isDeleteModalOpen && (
            <ModalSmall onClose={closeDeleteModal}>
              <ModalText>Are you sure?</ModalText>
              <ButtonContainer>
                <ConfirmButton onClick={handleDelete}>Yes</ConfirmButton>
                <CancelButton onClick={closeDeleteModal}>No</CancelButton>
              </ButtonContainer>
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
          <ToolPanel onAddText={openAddTextModal} onAddImage={openAddImageModal} onAddVideo={openAddVideoModal} />
          <button onClick={() => setPickerOpen(true)}>Background Settings</button>

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
                ? presentation.slides[currentSlideIndex].textBoxes.find((box) => box.id === editingTextBoxIndex)
                : null
            }
          />
          <AddImageModal
            isOpen={isAddImageModalOpen}
            onClose={closeAddImageModal}
            onSave={handleSaveImage}
            image={
              editingImageIndex !== null
                ? presentation.slides[currentSlideIndex].images.find((img) => img.id === editingImageIndex)
                : null
            }
          />
          <AddVideoModal
            isOpen={isAddVideoModalOpen}
            onClose={closeAddVideoModal}
            onSave={handleSaveVideo}
            video={
              editingVideoIndex !== null
                ? presentation.slides[currentSlideIndex].videos.find((vid) => vid.id === editingVideoIndex)
                : null}
          />
          <BackgroundPickerModal
            isOpen={isPickerOpen}
            onClose={() => setPickerOpen(false)}
            onSave={(background) => handleSaveBackground(background)}
            currentBackground={currentSlideBackground[currentSlideIndex] || null}
          />

          <SlideContainer style={applyBackgroundStyle(currentSlideBackground[currentSlideIndex] || defaultBackground)}>
            {presentation.slides[currentSlideIndex]?.videos?.map((video) => (
              <StyledVideo
                key={video.id}
                size={video.size}
                position={video.position || { x: 0, y: 0 }}
                zIndex={video.zIndex}
                onDelete={() => handleDeleteVideo(video.id)}
                onEdit={() => openEditVideoModal(video.id)}
                onPositionChange={(newPosition) => updateVideo(video.id, { position: newPosition })}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${video.autoplay ? 1 : 0
                    }&mute=${video.autoplay ? 1 : 0}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                ></iframe>
              </StyledVideo>
            ))}
            {presentation.slides[currentSlideIndex]?.images?.map((img) => (
              <StyledImage
                key={img.id}
                src={img.src}
                alt={img.description}
                size={img.size}
                position={img.position || { x: 0, y: 0 }}
                zIndex={img.zIndex}
                onDelete={() => handleDeleteImage(img.id)}
                onEdit={() => openEditImageModal(img.id)}
                onPositionChange={(newPosition) => updateImage(img.id, { position: newPosition })}
              />
            ))}
            {presentation.slides[currentSlideIndex]?.textBoxes?.map((box) => (
              <TextBox
                key={box.id}
                size={box.size}
                fontSize={box.fontSize}
                color={box.color}
                fontFamily={box.fontFamily}
                position={box.position || { x: 0, y: 0 }}
                zIndex={box.zIndex}
                text={box.text}
                onDelete={() => handleDeleteTextBox(box.id)}
                onEdit={() => openEditTextModal(box.id)}
                onPositionChange={(newPosition) => updateTextBox(box.id, { position: newPosition })}
              />
            ))}
            <SlideNumber currentSlideIndex={currentSlideIndex} />
          </SlideContainer>
        </div>
      ) : (
        <p>Loading presentation...</p>
      )}
    </Container>
  );
};

export default EditPresentation;
