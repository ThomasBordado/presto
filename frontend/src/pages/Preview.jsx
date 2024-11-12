import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../backend.config.json';
import { getToken } from '../Auth';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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

  const renderTextBox = (textBox) => (
    <div
      key={textBox.id}
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
    const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=${video.autoplay ? 1 : 0}`;

    return (
      <iframe
        key={video.id}
        src={embedUrl}
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

  return (
    <div style={{ position: 'relative', height: '100vh', margin: '-8px', ...getBackgroundStyle() }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {presentation.slides[currentSlide].textBoxes?.map(renderTextBox)}
        {presentation.slides[currentSlide].images?.map(renderImage)}
        {presentation.slides[currentSlide].videos?.map(renderVideo)}
        {presentation.slides[currentSlide].codeBlocks?.map(renderCode)}
      </div>
      <button
        style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: '999' }}
        onClick={goToPreviousSlide}
      >
        ←
      </button>
      <button
        style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: '999' }}
        onClick={goToNextSlide}
      >
        →
      </button>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'white' }}>
        Slide {currentSlide + 1} / {presentation.slides.length}
      </div>
    </div>
  );
};

export default Preview;
