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

const SelectField = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: 2px solid #0056b3;
    box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
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

const AddTextModal = ({ isOpen, onClose, onSave }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const textRef = useRef();
  const fontSizeRef = useRef();
  const colorRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();
  const fontFamilyRef = useRef();
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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
    <ModalMedium ref={modalRef} onClose={onClose} aria-labelledby="addTextModalLabel">
      <ErrorDisplay aria-live="assertive" />
      <FormTitle id="addTextModalLabel">Add Text Box</FormTitle>
      <FormLabel htmlFor="textContent">Text Content:</FormLabel>
      <InputField
        id="textContent"
        type="text"
        placeholder="Enter text"
        ref={textRef}
        aria-required="true"
        aria-describedby="textContentDesc"
      />
      <HiddenDescription id="textContentDesc">Add text to be put in slide</HiddenDescription>

      <FormLabel htmlFor="textFontSize">Font Size (em):</FormLabel>
      <InputField
        id="textFontSize"
        type="number"
        placeholder="Enter a font size"
        step="0.1"
        ref={fontSizeRef}
        defaultValue={1}
        aria-describedby="textFontSizeDesc"
      />
      <HiddenDescription id="textFontSizeDesc">Font size of text to be added</HiddenDescription>

      <FormLabel htmlFor="textColor">Text Color (Hex or Colour):</FormLabel>
      <InputField
        id="textColor"
        type="text"
        placeholder="Enter a font color"
        ref={colorRef}
        defaultValue={'black'}
        aria-describedby="textColorDesc"
      />
      <HiddenDescription id="textColorDesc">Font color of text to be added</HiddenDescription>

      <FormLabel htmlFor="textWidth">Width (%):</FormLabel>
      <InputField
        id="textWidth"
        type="number"
        placeholder="Enter a textbox width"
        ref={widthRef}
        defaultValue={50}
        aria-describedby="textWidthDesc"
      />
      <HiddenDescription id="textWidthDesc">Width of textbox to be added</HiddenDescription>

      <FormLabel htmlFor="textHeight">Height (%):</FormLabel>
      <InputField
        id="textHeight"
        type="number"
        placeholder="Enter a textbox height"
        ref={heightRef}
        defaultValue={50}
        aria-describedby="textHeightDesc"
      />
      <HiddenDescription id="textHeightDesc">Height of textbox to be added</HiddenDescription>

      <FormLabel htmlFor="textFontFamily">Font Family:</FormLabel>
      <SelectField id="textFontFamily" ref={fontFamilyRef}>
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
      </SelectField>

      <SubmitButton aria-label="submit text box" onClick={handleSave}>Add Text</SubmitButton>
    </ModalMedium>
  );
};

export default AddTextModal;
