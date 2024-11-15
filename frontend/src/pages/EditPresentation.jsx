import { useState, useEffect, useRef } from 'react';
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
import AddTextModal from '../components/AddTextModal';
import EditTextModal from '../components/EditTextModal';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import styled from 'styled-components';
import TextBox from '../components/TextBox';
import AddImageModal from '../components/AddImageModal';
import Logout from '../components/Logout';
import StyledImage from '../components/StyledImage';
import AddVideoModal from '../components/AddVideoModal';
import StyledVideo from '../components/StyledVideo';
import AddCodeModal from '../components/AddCodeModal';
import CodeBlock from '../components/CodeBlock';
import BackgroundPickerModal from '../components/BackgroundModalPicker';
import SlideRearrangeModal from '../components/SlideRearrangeModal';
import { v4 as uuidv4 } from 'uuid';
import { FiMenu, FiX } from 'react-icons/fi';

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

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 24px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: #333;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;

  button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;

    &:hover {
      background-color: #555;
    }
  }
`;

const BackButton = styled.option`
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

const DeleteButton = styled.option`
  font-family: Arial, sans-serif;
  background-color: transparent;
  color: #f44336;
  // margin-right: 10px;
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

const FileInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const HiddenDescription = styled.p`
  visibility: hidden;
  position: absolute;
`;

const SaveButton = styled.button`
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

const CancelButton = styled.button`
  font-family: Arial, sans-serif;
  width: 100px;
  background-color: #b22222;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8B1A1A;
  }

  &:focus {
    outline: 2px solid #ffffff;
  }
`;

const useIsMobile = (maxWidth = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= maxWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth]);

  return isMobile;
};

const EditPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTitleEditModalOpen, setIsTitleEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAddTextModalOpen, setIsAddTextModalOpen] = useState(false);
  const [isEditTextModalOpen, setIsEditTextModalOpen] = useState(false);
  const [editingTextBoxIndex, setEditingTextBoxIndex] = useState(null);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);
  const [editingCodeIndex, setEditingCodeIndex] = useState(null);
  const [isAnyModalOpen, setModalOpen] = useState(false);
  const slideContainerRef = useRef(null);
  const { showError, ErrorDisplay } = useErrorMessage();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isMobile = useIsMobile();
  

  useEffect(() => {
    const handleURLChange = () => {
      const slideParam = parseInt(new URLSearchParams(window.location.search).get("slide"), 10);
      if (!isNaN(slideParam) && slideParam !== currentSlideIndex) {
        setCurrentSlideIndex(slideParam);
      }
    };

    handleURLChange();
    window.addEventListener("popstate", handleURLChange);
    return () => window.removeEventListener("popstate", handleURLChange);
  }, [currentSlideIndex]);

  useEffect(() => {
    const fetchPresentation = async () => {
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const store = response.data.store;
        const presentations = store.presentations || [];

        const foundPresentation = presentations.find(
          (presentation) => presentation.id === id
        );

        if (foundPresentation) {
          setPresentation(foundPresentation);
          setNewTitle(foundPresentation.name);

          const urlParams = new URLSearchParams(window.location.search);
          if (!urlParams.has("slide")) {
            urlParams.set("slide", 0);
            navigate(`?${urlParams.toString()}`, { replace: true });
          }
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id, navigate]);

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
      const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations;

      const updatedPresentations = presentations.filter(
        (presentation) => presentation.id !== id
      );

      await axios.put(
        `${config.BACKEND_LOCAL}/store`,
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

  const openBackgroundModal = () => {
    setPickerOpen(true);
    setModalOpen(true);
  };

  const closeBackgroundModal = () => {
    setPickerOpen(false);
    setModalOpen(false);
  };

  const handleSaveBackground = async (updatedBackground) => {
    const updatedSlides = [...presentation.slides];

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      background: updatedBackground,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    closeBackgroundModal();
  };

  const handleSaveDefault = async (background) => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const updatedPresentation = { ...presentation, default_background: background };

      const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations || [];

      const updatedPresentations = presentations.map((pres) =>
        pres.id === id ? updatedPresentation : pres
      );

      await axios.put(
        `${config.BACKEND_LOCAL}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPresentation(updatedPresentation);
      closeBackgroundModal();
    } catch (error) {
      console.error('Error updating default background: ', error);
    }
  };

  const applyBackgroundStyle = (background) => {
    if (!background) return {};
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

  const handleTitleSave = async (e) => {
    e.preventDefault();

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

      const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations || [];

      const updatedPresentations = presentations.map((pres) =>
        pres.id === id ? updatedPresentation : pres
      );

      await axios.put(
        `${config.BACKEND_LOCAL}/store`,
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

        const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const store = response.data.store;
        const presentations = store.presentations || [];

        const updatedPresentations = presentations.map((pres) =>
          pres.id === id ? updatedPresentation : pres
        );

        await axios.put(
          `${config.BACKEND_LOCAL}/store`,
          { store: { presentations: updatedPresentations } },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPresentation(updatedPresentation);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create slide
  const handleCreateSlide = async () => {
    const newSlide = { id: uuidv4() };
    const updatedSlides = [...presentation.slides, newSlide];
    await saveSlides(updatedSlides);
    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    const newSlideIndex = updatedSlides.length - 1;
    setCurrentSlideIndex(newSlideIndex);
    window.history.replaceState(null, "", `?slide=${newSlideIndex}`);
  };

  // Delete slide
  const handleDeleteSlide = async () => {
    if (presentation.slides.length === 1) {
      showError('Cannot delete the only slide. Delete the presentation instead.');
      return;
    }

    const updatedSlides = [...presentation.slides];
    updatedSlides.splice(currentSlideIndex, 1);

    await saveSlides(updatedSlides);
    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    let newSlideIndex = currentSlideIndex;
    if (currentSlideIndex >= updatedSlides.length) {
      newSlideIndex = updatedSlides.length - 1;
    }
    setCurrentSlideIndex(newSlideIndex);
    const newUrl = `${window.location.pathname}?slide=${newSlideIndex}`;
    window.history.replaceState(null, '', newUrl);
  };

  const saveSlides = async (updatedSlides) => {
    const token = getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    try {
      const updatedPresentation = { ...presentation, slides: updatedSlides };

      const response = await axios.get(`${config.BACKEND_LOCAL}/store`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = response.data.store;
      const presentations = store.presentations || [];

      const updatedPresentations = presentations.map((pres) =>
        pres.id === id ? updatedPresentation : pres
      );

      await axios.put(
        `${config.BACKEND_LOCAL}/store`,
        { store: { presentations: updatedPresentations } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error saving slides:', error);
    }
  };

  const goToPreviousSlide = () => setSlideIndex(Math.max(currentSlideIndex - 1, 0));
  const goToNextSlide = () => setSlideIndex(Math.min(currentSlideIndex + 1, presentation.slides.length - 1));

  const setSlideIndex = (index) => {
    setCurrentSlideIndex(index);
    navigate(`/presentation/${id}?slide=${index}`);
  };

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
    const codeBlocks = updatedSlides[currentSlideIndex].codeBlocks || [];

    let updatedTextBoxes;

    if (editingTextBoxIndex) {
      updatedTextBoxes = textBoxes.map((box) => (box.id === editingTextBoxIndex ? textBox : box));
    } else {
      const highestZIndex = Math.max(
        ...textBoxes.map((box) => box.zIndex || 0),
        ...images.map((img) => img.zIndex || 0),
        ...videos.map((vid) => vid.zIndex || 0),
        ...codeBlocks.map((code) => code.zIndex || 0),
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
    const codeBlocks = updatedSlides[currentSlideIndex].codeBlocks || [];


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
        ...(codeBlocks).map((code) => code.zIndex || 0),
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
    const codeBlocks = updatedSlides[currentSlideIndex].codeBlocks || [];

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
        ...(codeBlocks).map((code) => code.zIndex || 0),
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

  const openAddCodeModal = () => {
    setIsAddCodeModalOpen(true);
    setModalOpen(true);
  }
  const closeAddCodeModal = () => {
    setIsAddCodeModalOpen(false);
    setEditingCodeIndex(null);
    setModalOpen(false);
  };

  const openEditCodeModal = (id) => {
    setEditingCodeIndex(id);
    setIsAddCodeModalOpen(true);
    setModalOpen(true);
  };

  const handleSaveCode = async (codeData) => {
    const updatedSlides = [...presentation.slides];
    const textBoxes = updatedSlides[currentSlideIndex].textBoxes || [];
    const images = updatedSlides[currentSlideIndex].images || [];
    const videos = updatedSlides[currentSlideIndex].videos || [];
    const codeBlocks = updatedSlides[currentSlideIndex].codeBlocks || [];


    let updatedCodeBlocks = null;
    if (editingCodeIndex) {
      updatedCodeBlocks = codeBlocks.map((code) =>
        (code.id === editingCodeIndex)
          ? { ...codeData, zIndex: code.zIndex ?? codeData.zIndex }
          : code
      );
    } else {
      const highestZIndex = Math.max(
        ...(textBoxes).map((box) => box.zIndex || 0),
        ...(images).map((img) => img.zIndex || 0),
        ...(videos).map((vid) => vid.zIndex || 0),
        ...(codeBlocks).map((code) => code.zIndex || 0),
        0
      );
      const newCodeData = { ...codeData, zIndex: highestZIndex + 1 };
      updatedCodeBlocks = [...codeBlocks, newCodeData];
    }

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      codeBlocks: updatedCodeBlocks,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));

    closeAddCodeModal();
  };

  const handleDeleteCode = async (id) => {
    const updatedSlides = [...presentation.slides];
    const updatedCodeBlocks = updatedSlides[currentSlideIndex].codeBlocks.filter((code) => code.id !== id);

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      codeBlocks: updatedCodeBlocks,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
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

  const handlePreviewClick = () => {
    window.open(`/preview/${presentation.id}`, '_blank');
  };

  const updateCode = async (id, updatedProps) => {
    const updatedSlides = [...presentation.slides];
    const codeBlocks = updatedSlides[currentSlideIndex].codeBlocks;

    const updatedCodeBlocks = codeBlocks.map((code) =>
      code.id === id ? { ...code, ...updatedProps } : code
    );

    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      codeBlocks: updatedCodeBlocks,
    };

    await saveSlides(updatedSlides);

    setPresentation((prev) => ({
      ...prev,
      slides: updatedSlides,
    }));
  };

  const [isRearrangeModalOpen, setRearrangeModalOpen] = useState(false);

  const openRearrangeModal = () => {
    setRearrangeModalOpen(true);
    setModalOpen(true);
  }
  const closeRearrangeModal = () => {
    setRearrangeModalOpen(false);
    setModalOpen(false);
  }

  const handleRearrangeSlides = (newOrder) => {
    const updatedSlides = newOrder.map((slide, index) => ({ ...slide, order: index }));
    saveSlides(updatedSlides);
    setPresentation((prev) => ({ ...prev, slides: updatedSlides }));
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const format = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    if (window.innerWidth > 768) setMenuOpen(false);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container>
      <ErrorDisplay aria-live="assertive" />
      {presentation ? (
        <div>
          <HeaderBar>
            <PresentationTitle>
              {isMobile ? format(presentation.name, 12) : format(presentation.name, 30)}
              <IconButton onClick={openTitleEditModal} aria-label="Edit Presentation Title and Thumbnail">
                <FaEdit />
              </IconButton>
            </PresentationTitle>
            
            <ButtonGroup>
              <BackButton onClick={handleBack} aria-label="Go Back To Dashboard">
                Back
              </BackButton>
              <DeleteButton onClick={openDeleteModal} aria-label="Delete Presentation">
                Delete Presentation
              </DeleteButton>
              <Logout aria-label="Logout" />
            </ButtonGroup>

            <MenuIcon onClick={toggleMenu} aria-label="Toggle Menu">
              {menuOpen ? <FiX /> : <FiMenu />}
            </MenuIcon>

            {menuOpen && (
              <DropdownMenu ref={menuRef}>
                <BackButton onClick={handleBack} aria-label="Go Back To Dashboard">
                  Back
                </BackButton>
                <DeleteButton onClick={openDeleteModal} aria-label="Delete Presentation">
                  Delete Presentation
                </DeleteButton>
                <Logout aria-label="Logout" />
              </DropdownMenu>
            )}
          </HeaderBar>

          {isTitleEditModalOpen && (
            <ModalMedium onClose={closeTitleEditModal} aria-labelledby="modal-title">
              <ModalTitle id="modal-title">Edit Presentation Details</ModalTitle>
              <form onSubmit={handleTitleSave} aria-label="Edit presentation title and thumbnail form">
                <FormLabel htmlFor="editPresoEditTitle">Title:</FormLabel>
                <InputField
                  id="editPresoEditTitle"
                  type="text"
                  placeholder="Enter presentation name"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  aria-describedby="editPresoEditTitleDesc"
                />
                <HiddenDescription id="editPresoEditTitleDesc">Edit presentation title</HiddenDescription>

                <FormLabel htmlFor="editPresoEditThumbnail">Thumbnail:</FormLabel>
                <FileInput
                  id="editPresoEditThumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  aria-describedby="editPresoEditTitleDesc"
                />
                <HiddenDescription id="editPresoEditThumbnailDesc">Upload a new presentation thumbnail</HiddenDescription>

                <SaveButton type="submit" aria-label="Save Title and Thumbnail">Save</SaveButton>
              </form>
            </ModalMedium>
          )}

          {isDeleteModalOpen && (
            <ModalSmall onClose={closeDeleteModal} aria-labelledby="confirmPresentationDelete" aria-modal="true">
              <ModalText id="confirmPresentationDelete">Are you sure?</ModalText>
              <ButtonContainer>
                <ConfirmButton onClick={handleDelete} aria-label="Confirm Deletion">
                  Yes
                </ConfirmButton>
                <CancelButton onClick={closeDeleteModal} aria-label="Cancel Deletion">
                  No
                </CancelButton>
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
            onAddText={openAddTextModal}
            onAddImage={openAddImageModal}
            onAddVideo={openAddVideoModal}
            onAddCode={openAddCodeModal}
            openBackgroundModal={openBackgroundModal}
            openRearrangeModal={openRearrangeModal}
            handlePreviewClick={handlePreviewClick}
            aria-label="slide controls"
          />

          <AddTextModal
            isOpen={isAddTextModalOpen}
            onClose={closeAddTextModal}
            onSave={handleSaveTextBox}
            aria-labelledby="addTextModalLabel"
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
            aria-labelledby="editTextModalLabel"
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
            aria-labelledby="addImageModalLabel"
          />
          <AddVideoModal
            isOpen={isAddVideoModalOpen}
            onClose={closeAddVideoModal}
            onSave={handleSaveVideo}
            video={
              editingVideoIndex !== null
                ? presentation.slides[currentSlideIndex].videos.find((vid) => vid.id === editingVideoIndex)
                : null
            }
            aria-labelledby="addVideoModalLabel"
          />
          <AddCodeModal
            isOpen={isAddCodeModalOpen}
            onClose={closeAddCodeModal}
            onSave={handleSaveCode}
            code={
              editingCodeIndex !== null
                ? presentation.slides[currentSlideIndex].codeBlocks.find((code) => code.id === editingCodeIndex)
                : null
            }
            aria-labelledby="addVideoModalLabel"
          />
          <BackgroundPickerModal
            isOpen={isPickerOpen}
            onClose={closeBackgroundModal}
            onSaveBackground={(background) => handleSaveBackground(background)}
            onSaveDefault={(background) => handleSaveDefault(background)}
            currentBackground={presentation.slides[currentSlideIndex].background || null}
            aria-labelledby="editBackgroundModalLabel"
          />

          <SlideContainer 
            ref={slideContainerRef} 
            data-testid="slide-container"
            style={applyBackgroundStyle(presentation.slides[currentSlideIndex].background || presentation.default_background)}
          >
            {isRearrangeModalOpen && (
              <SlideRearrangeModal
                slides={presentation.slides}
                onClose={closeRearrangeModal}
                onRearrange={handleRearrangeSlides}
              />
            )}
            {presentation.slides[currentSlideIndex]?.codeBlocks?.map((code) => (
              <CodeBlock
                key={code.id}
                code={code.content}
                size={code.size}
                fontSize={code.fontSize}
                position={code.position || { x: 0, y: 0 }}
                zIndex={code.zIndex}
                detectedLang={code.language}
                onDelete={() => handleDeleteCode(code.id)}
                onEdit={() => openEditCodeModal(code.id)}
                onChange={(newProps) => updateCode(code.id, { position: newProps.position, size: newProps.size })}
                slideContainerRef={slideContainerRef}
                aria-label={`Code Block in ${code.language}`}
              />
            ))}
            {presentation.slides[currentSlideIndex]?.videos?.map((video) => (
              <StyledVideo
                key={video.id}
                size={video.size}
                position={video.position || { x: 0, y: 0 }}
                zIndex={video.zIndex}
                onDelete={() => handleDeleteVideo(video.id)}
                onEdit={() => openEditVideoModal(video.id)}
                onChange={(newProps) => updateVideo(video.id, { position: newProps.position, size: newProps.size })}
                slideContainerRef={slideContainerRef}
                aria-label="Video Block"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${video.autoplay ? 1 : 0}&mute=${video.autoplay ? 1 : 0}&enablejsapi=1`}
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
                onChange={(newProps) => updateImage(img.id, { position: newProps.position, size: newProps.size })}
                slideContainerRef={slideContainerRef}
                aria-label="Image Block"
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
                onChange={(newProps) => updateTextBox(box.id, { position: newProps.position, size: newProps.size })}
                slideContainerRef={slideContainerRef}
                aria-label="Text Block"
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
