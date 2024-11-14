import { useRef } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';

const FormField = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const AddTextModal = ({ isOpen, onClose, onSave }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const textRef = useRef();
  const fontSizeRef = useRef();
  const colorRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();
  const fontFamilyRef = useRef();

  const handleSave = () => {
    const width = parseInt(widthRef.current.value, 10);
    const height = parseInt(heightRef.current.value, 10);

    if (width < 0 || width > 100 || height < 0 || height > 100) {
      showError('Width or Height is not between 0 and 100');
      return;
    }

    const newTextBox = {
      id: uuidv4(),
      text: textRef.current.value,
      fontSize: parseFloat(fontSizeRef.current.value),
      color: colorRef.current.value,
      fontFamily: fontFamilyRef.current.value,
      size: {
        width: parseInt(widthRef.current.value, 10),
        height: parseInt(heightRef.current.value, 10),
      },
      position: { x: 0, y: 0 },
    };

    onSave(newTextBox);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <ErrorDisplay />
      <h3>Add Text Box</h3>

      <FormField>
        <label for="contentInput">Text Content:</label>
        <input id="contentInput" type="text" ref={textRef} />
      </FormField>

      <FormField>
        <label for="fontSizeInput">Font Size (em):</label>
        <input id="fontSizeInput" type="number" step="0.1" ref={fontSizeRef} defaultValue={1} />
      </FormField>

      <FormField>
        <label for="colourInput">Text Color (Hex or Colour):</label>
        <input id="colourInput" type="text" ref={colorRef} defaultValue={'black'} />
      </FormField>

      <FormField>
        <label for="widthInput">Width (%):</label>
        <input id="widthInput" type="number" ref={widthRef} defaultValue={50} />
      </FormField>

      <FormField>
        <label for="heightInput">Height (%):</label>
        <input id="heightInput" type="number" ref={heightRef} defaultValue={50} />
      </FormField>

      <FormField>
        <label for="fontFamilyInput">Font Family:</label>
        <select id="fontFamilyInput" ref={fontFamilyRef}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </FormField>

      <button onClick={handleSave}>Add Text</button>
    </ModalMedium>
  );
};

export default AddTextModal;
