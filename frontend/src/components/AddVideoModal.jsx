import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';

const FormField = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const AddVideoModal = ({ isOpen, onClose, onSave, video }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const urlRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();
  const autoplayRef = useRef();

  useEffect(() => {
    if (video) {
      urlRef.current.value = video.url;
      autoplayRef.current.checked = video.autoplay;
    }
  }, [video]);

  const handleAddSave = () => {
    const width = parseInt(widthRef.current.value, 10);
    const height = parseInt(heightRef.current.value, 10);
    const autoplay = autoplayRef.current.checked;
    const url = urlRef.current.value.trim();

    if (width < 0 || width > 100 || height < 0 || height > 100) {
      showError("Width or Height must be between 0 and 100.");
      return;
    }

    if (!url) {
      showError('Please provide a YouTube video URL.');
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      showError('Invalid YouTube URL.');
      return;
    }

    const newVideo = {
      id: uuidv4(),
      url,
      videoId,
      autoplay,
      size: { width, height },
      position: { x: 0, y: 0 },
    };

    onSave(newVideo);
    onClose();
  };

  const handleEditSave = () => {
    const autoplay = autoplayRef.current.checked;
    const url = urlRef.current.value.trim();

    if (!url) {
      showError('Please provide a YouTube video URL.');
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      showError('Invalid YouTube URL.');
      return;
    }

    const newVideo = {
      ...video,
      url,
      videoId,
      autoplay,
    };

    onSave(newVideo);
    onClose();
  };

  const extractYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <ErrorDisplay />
      <h3>{video ? 'Edit Video' : 'Add Video'}</h3>

      <FormField>
        <label>YouTube Video URL:</label>
        <input type="text" ref={urlRef} defaultValue={video?.url || ''} />
      </FormField>

      {!video && (
        <>
          <FormField>
            <label>Width (%):</label>
            <input type="number" ref={widthRef} defaultValue={video?.size?.width || 50} min="1" max="100" />
          </FormField>

          <FormField>
            <label>Height (%):</label>
            <input type="number" ref={heightRef} defaultValue={video?.size?.height || 50} min="1" max="100" />
          </FormField>
        </>

      )}

      <FormField>
        <label>
          <input type="checkbox" ref={autoplayRef} />
          Auto-play
        </label>
      </FormField>

      <button onClick={video ? handleEditSave : handleAddSave}>
        {video ? "Save Changes" : "Add Video"}
      </button>
    </ModalMedium>
  );
};

export default AddVideoModal;
