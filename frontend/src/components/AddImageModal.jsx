import { useRef, useState, useEffect } from 'react';
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

const AddImageModal = ({ isOpen, onClose, onSave, image }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const [imageData, setImageData] = useState(image ? image.src : null);

  const urlRef = useRef();
  const fileRef = useRef();
  const descriptionRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();

  useEffect(() => {
    if (image) {
      urlRef.current.value = image.src;
      descriptionRef.current.value = image.description;
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleAddSave = () => {
    const width = parseInt(widthRef.current.value, 10);
    const height = parseInt(heightRef.current.value, 10);

    if (width < 0 || width > 100 || height < 0 || height > 100) {
      showError("Width or Height must be between 0 and 100.");
      return;
    }

    const imageSrc = imageData || urlRef.current.value;

    if (!imageSrc) {
      showError("Please provide an image URL or upload a file.");
      return;
    }

    const newImage = {
      id: uuidv4(),
      src: imageSrc,
      description: descriptionRef.current.value,
      size: { width, height },
      position: { x: 0, y: 0 }
    };

    onSave(newImage);
    onClose();
    setImageData(null);
  };

  const handleEditSave = () => {
    const updatedImage = {
      ...image,
      src: imageData || urlRef.current.value,
      description: descriptionRef.current.value,
    };

    onSave(updatedImage);
    onClose();
    setImageData(null);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose} aria-labelledby="addEditImageModalLabel" aria-hidden={!isOpen}>
      <ErrorDisplay aria-live="assertive" />
      <FormTitle id="addEditImageModalLabel">{image ? "Edit Image" : "Add Image"}</FormTitle>

      <FormLabel htmlFor="imageURL">Image URL:</FormLabel>
      <InputField
        id="imageURL"
        type="text"
        placeholder="Enter image URL"
        ref={urlRef}
        defaultValue={image?.src || ''}
        aria-required="true"
        aria-describedby="imageURLDesc"
      />
      <HiddenDescription id="textContentDesc">Image URL</HiddenDescription>

      <FormLabel htmlFor="imageFile">Or Upload Image:</FormLabel>
      <FileInput
        id="imageFile"
        type="file"
        ref={fileRef}
        onChange={handleFileChange}
        aria-label="Upload image file"
        aria-describedby="imageFileDesc"
      />
      <HiddenDescription id="imageFileDesc">Upload image file</HiddenDescription>

      <FormLabel htmlFor="imageDescription">Image Description (Alt text):</FormLabel>
      <InputField
        id="imageDescription"
        type="text"
        placeholder="Enter image description"
        ref={descriptionRef}
        defaultValue={image?.description || ''}
        aria-required="true"
        aria-describedby="imageDescriptionDesc"
      />
      <HiddenDescription id="imageDescriptionDesc">Enter a description for image</HiddenDescription>

      {!image && (
        <>
          <FormLabel htmlFor="imageWidth">Width (%):</FormLabel>
          <InputField
            id="imageWidth"
            type="number"
            placeholder="Enter an image box width"
            ref={widthRef}
            defaultValue={50}
            aria-describedby="imageWidthDesc"
          />
          <HiddenDescription id="imageWidthDesc">Width of image box to be added</HiddenDescription>

          <FormLabel htmlFor="imageHeight">Height (%):</FormLabel>
          <InputField
            id="imageHeight"
            type="number"
            placeholder="Enter an image box height"
            ref={heightRef}
            defaultValue={50}
            aria-describedby="imageHeightDesc"
          />
          <HiddenDescription id="imageHeightDesc">Height of image box to be added</HiddenDescription>
        </>
      )}

      <SubmitButton aria-label="submit image" onClick={image ? handleEditSave : handleAddSave}>
        {image ? "Save Changes" : "Add Image"}
      </SubmitButton>
    </ModalMedium>
  );
};

export default AddImageModal;
