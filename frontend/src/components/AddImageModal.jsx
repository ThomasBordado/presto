import React, { useRef, useState, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';

const FormField = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
`;

const AddImageModal = ({ isOpen, onClose, onSave, image }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const [imageData, setImageData] = useState(image ? image.src : null);

  const urlRef = useRef();
  const fileRef = useRef();
  const descriptionRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();
  const xPosRef = useRef();
  const yPosRef = useRef();

  useEffect(() => {
    if (image) {
      urlRef.current.value = image.src;
      descriptionRef.current.value = image.description;
      widthRef.current.value = image.size.width;
      heightRef.current.value = image.size.height;
      xPosRef.current.value = image.position?.x ?? 0;
      yPosRef.current.value = image.position?.y ?? 0;
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
    const width = parseInt(widthRef.current.value, 10);
    const height = parseInt(heightRef.current.value, 10);
    const xpos = parseInt(xPosRef.current.value, 10);
    const ypos = parseInt(yPosRef.current.value, 10);
  
    if (width < 0 || width > 100 || height < 0 || height > 100 || xpos < 0 || xpos > 100 || ypos < 0 || ypos > 100) {
      showError("Width, Height, and Position values must be between 0 and 100.");
      return;
    }
  
    if (xpos + width > 100 || ypos + height > 100) {
      showError("Image can't be moved here due to overflow.");
      return;
    }
  
    const updatedImage = {
      src: imageData || urlRef.current.value,
      description: descriptionRef.current.value,
      size: { width, height },
      position: { x: xpos, y: ypos }
    };
  
    onSave(updatedImage);
    onClose();
    setImageData(null);
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <ErrorDisplay />
      <h3>{image ? "Edit Image" : "Add Image"}</h3>

      <FormField>
        <label>Image URL:</label>
        <input type="text" ref={urlRef} defaultValue={image?.src || ''} />
      </FormField>

      <FormField>
        <label>Or Upload Image:</label>
        <input type="file" ref={fileRef} onChange={handleFileChange} />
      </FormField>

      <FormField>
        <label>Image Description (Alt text):</label>
        <input type="text" ref={descriptionRef} defaultValue={image?.description || ''} />
      </FormField>

      <FormField>
        <label>Width (%):</label>
        <input type="number" ref={widthRef} defaultValue={image?.size?.width || 50} min="0" max="100" />
      </FormField>

      <FormField>
        <label>Height (%):</label>
        <input type="number" ref={heightRef} defaultValue={image?.size?.height || 50} min="0" max="100" />
      </FormField>

      {image && (
        <>
          <FormField>
            <label>Position X (%):</label>
            <input type="number" ref={xPosRef} defaultValue={image?.position?.x || 0} min="0" max="100" />
          </FormField>

          <FormField>
            <label>Position Y (%):</label>
            <input type="number" ref={yPosRef} defaultValue={image?.position?.y || 0} min="0" max="100" />
          </FormField>
        </>
      )}
      <button onClick={image ? handleEditSave : handleAddSave}>
        {image ? "Save Changes" : "Add Image"}
      </button>
    </ModalMedium>
  );
};

export default AddImageModal;