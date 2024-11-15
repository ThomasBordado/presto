import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../backend.config.json';
import { getToken } from '../Auth';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const SlideContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: -8px;
  height: 100vh;

  @media (max-width: 768px) {
    margin: 0px;
    border: 1px solid black;
    transform: rotate(90deg);
    transform-origin: center center;
    width: 100vh; 
    height: 100vw; 
    max-width: none;
    max-height: none; 
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-family: Arial, sans-serif;
  font-size: 1em;
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 5px;
  border: none;
  border-radius: 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 500;
  transition: background-color 0.3s ease;

  &:focus {
    outline: 2px solid white;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const SlideInfo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-family: Arial, sans-serif;
  font-size: 1em;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
`;

const SlideContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Preview = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [direction, setDirection] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const getSlideFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('slide'), 10) || 0;
  };

  // Fetch presentation data
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
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id]);

  // After presentation is loaded, set the initial slide based on URL parameter
  useEffect(() => {
    if (presentation && currentSlide === null) {
      setCurrentSlide(getSlideFromUrl());
    }
  }, [presentation, currentSlide]);

  // Update the slide parameter when the slide is changed
  useEffect(() => {
    if (currentSlide !== null) {
      const params = new URLSearchParams(location.search);
      params.set('slide', currentSlide);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [currentSlide, navigate, location.pathname]);

  // Arrow keys to move through slides
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!presentation) return;

      if (event.key === 'ArrowLeft') {
        goToPreviousSlide();
      } else if (event.key === 'ArrowRight') {
        goToNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [presentation, currentSlide]);

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setDirection(1);
    }
  };

  if (!presentation || currentSlide === null) return <div>Loading...</div>;

  // Apply the background of each slide
  const getBackgroundStyle = () => {
    const slide = presentation.slides[currentSlide];
    const background = slide.background || presentation.default_background;

    if (background.type === 'gradient') {
      return {
        background: `linear-gradient(${background.gradient.direction}, ${background.gradient.start}, ${background.gradient.end})`,
      };
    } else if (background.type === 'image' && background.image) {
      return {
        backgroundImage: `url(${background.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    } else {
      return { backgroundColor: background.color || '#ffffff' };
    }
  };

  const renderTextBox = (textBox) => (
    <div
      key={textBox.id}
      aria-label={`Text box: ${textBox.text}`}
      style={{
        position: 'absolute',
        left: `${textBox.position.x}%`,
        top: `${textBox.position.y}%`,
        fontSize: `${textBox.fontSize}em`,
        fontFamily: textBox.fontFamily,
        color: textBox.color || '#000',
        width: `${textBox.size.width}%`,
        height: `${textBox.size.height}%`,
        zIndex: textBox.zIndex,
      }}
    >
      {textBox.text}
    </div>
  );

  const renderImage = (image) => (
    <img
      key={image.id}
      src={image.src}
      alt={image.description || 'Image'}
      style={{
        position: 'absolute',
        left: `${image.position.x}%`,
        top: `${image.position.y}%`,
        width: `${image.size.width}%`,
        height: `${image.size.height}%`,
        zIndex: image.zIndex,
      }}
    />
  );

  const renderVideo = (video) => {
    return (
      <iframe
        key={video.id}
        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${video.autoplay ? 1 : 0}`}
        title={video.description || 'Video'}
        allow="autoplay; encrypted-media"
        style={{
          position: 'absolute',
          left: `${video.position.x}%`,
          top: `${video.position.y}%`,
          width: `${video.size.width}%`,
          height: `${video.size.height}%`,
          zIndex: video.zIndex,
        }}
      />
    );
  };

  const renderCode = (code) => (
    <div
      key={code.id}
      aria-label={`Code block: ${code.language}`}
      style={{
        position: 'absolute',
        left: `${code.position.x}%`,
        top: `${code.position.y}%`,
        fontSize: `${code.fontSize}em`,
        width: `${code.size.width}%`,
        height: `${code.size.height}%`,
        zIndex: code.zIndex,
      }}
    >
      <SyntaxHighlighter
        language={code.language}
        style={docco}
        customStyle={{ padding: 5, margin: 0 }}
        showLineNumbers
      >
        {code.content}
      </SyntaxHighlighter>
    </div>
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <SlideContainer style={getBackgroundStyle()}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <SlideContent>
            {presentation.slides[currentSlide].textBoxes?.map(renderTextBox)}
            {presentation.slides[currentSlide].images?.map(renderImage)}
            {presentation.slides[currentSlide].videos?.map(renderVideo)}
            {presentation.slides[currentSlide].codeBlocks?.map(renderCode)}
          </SlideContent>
        </motion.div>
      </AnimatePresence>

      {currentSlide > 0 && (
        <NavigationButton onClick={goToPreviousSlide} style={{ left: 10 }} aria-label="Previous Slide">
          <FiChevronLeft />
        </NavigationButton>
      )}

      {presentation && currentSlide < presentation.slides.length - 1 && (
        <NavigationButton onClick={goToNextSlide} style={{ right: 10 }} aria-label="Next Slide">
          <FiChevronRight />
        </NavigationButton>
      )}

      <SlideInfo aria-live="polite">
        {currentSlide + 1} / {presentation.slides.length}
      </SlideInfo>
    </SlideContainer>
  );
};

export default Preview;
