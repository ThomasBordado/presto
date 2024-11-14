import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';

const FormTitle = styled.h2`
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
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

  &:focus {
    outline: 2px solid #0056b3;
  }
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
    <ModalMedium onClose={onClose} aria-labelledby="modal-title">
      <ErrorDisplay aria-live="assertive" />
      <FormTitle id="modal-title">{video ? 'Edit Video' : 'Add Video'}</FormTitle>

      <FormLabel htmlFor="videoURL">YouTube Video URL:</FormLabel>
      <InputField
        id="videoURL"
        type="text"
        placeholder="Enter video URL"
        ref={urlRef}
        defaultValue={video?.url || ''}
        aria-required="true"
        aria-describedby="videoURLDesc"
      />
      <HiddenDescription id="videoURLDesc">Video URL</HiddenDescription>

      {!video && (
        <>
          <FormLabel htmlFor="videoWidth">Width (%):</FormLabel>
          <InputField
            id="videoWidth"
            type="number"
            placeholder="Enter a video box width"
            ref={widthRef}
            defaultValue={video?.size?.width || 50}
            min="1"
            max="100"
            aria-required="true"
            aria-describedby="videoWidthDesc"
          />
          <HiddenDescription id="videoWidthDesc">Width of video box to be added</HiddenDescription>

          <FormLabel htmlFor="videoHeight">Height (%):</FormLabel>
          <InputField
            id="videoHeight"
            type="number"
            placeholder="Enter a video box height"
            ref={heightRef}
            defaultValue={video?.size?.height || 50}
            min="1"
            max="100"
            aria-required="true"
            aria-describedby="videoHeightDesc"
          />
          <HiddenDescription id="videoHeightDesc">Height of video box to be added</HiddenDescription>
        </>
      )}

      <FormLabel htmlFor="videoAutoplay">
        <input id="videoAutoplay" type="checkbox" ref={autoplayRef} />
        Auto-play
      </FormLabel>

      <SubmitButton aria-label="submit video" onClick={video ? handleEditSave : handleAddSave}>
        {video ? "Save Changes" : "Add Video"}
      </SubmitButton>
    </ModalMedium>
  );
};

export default AddVideoModal;
