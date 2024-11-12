import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../backend.config.json';
import { getToken } from '../Auth';

const Preview = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
        } else {
          console.error('Presentation not found');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      }
    };

    fetchPresentation();
  }, [id]);

  // Arrow keys t move through slides
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
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const goToNextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  if (!presentation) return <div>Loading...</div>;

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

  return (
    <div style={{ position: 'relative', height: '100vh', margin: '-8px', ...getBackgroundStyle() }}>

      {/* Slide navigation */}
      <button
        style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }}
        onClick={goToPreviousSlide}
      >
        ←
      </button>
      <button
        style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }}
        onClick={goToNextSlide}
      >
        →
      </button>
      {/* Current slide / total slides */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'white' }}>
        Slide {currentSlide + 1} / {presentation.slides.length}
      </div>
    </div>
  );
};

export default Preview;
