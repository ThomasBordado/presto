import { useRef, useState, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';

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
      {!image && (
        <>
          <FormField>
            <label>Width (%):</label>
            <input type="number" ref={widthRef} defaultValue={50} />
          </FormField>

          <FormField>
            <label>Height (%):</label>
            <input type="number" ref={heightRef} defaultValue={50} />
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