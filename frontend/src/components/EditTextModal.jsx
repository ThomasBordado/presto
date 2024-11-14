import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';

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


const EditTextModal = ({ isOpen, onClose, onSave, textBox }) => {
  const { ErrorDisplay } = useErrorMessage();

  const textRef = useRef();
  const fontSizeRef = useRef();
  const colorRef = useRef();
  const fontFamilyRef = useRef();

  useEffect(() => {
    if (textBox) {
      textRef.current.value = textBox.text;
      fontSizeRef.current.value = textBox.fontSize;
      colorRef.current.value = textBox.color;
      fontFamilyRef.current.value = textBox.fontFamily ?? 'Arial';
    }
  }, [textBox]);

  const handleSave = () => {
    const updatedTextBox = {
      ...textBox,
      text: textRef.current.value,
      fontSize: parseFloat(fontSizeRef.current.value),
      color: colorRef.current.value,
      fontFamily: fontFamilyRef.current.value,
    };

    onSave(updatedTextBox);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <ErrorDisplay />
      <FormTitle>Edit Text Box</FormTitle>

      <FormLabel htmlFor="textContentEdit">Text Content:</FormLabel>
      <InputField
        id="textContentEdit"
        type="text"
        placeholder="Edit text"
        ref={textRef}
        aria-required="true"
        aria-describedby="textContentEditDesc"
      />
      <HiddenDescription id="textContentEditDesc">Edit text in box</HiddenDescription>

      <FormLabel htmlFor="textFontSizeEdit">Font Size (em):</FormLabel>
      <InputField
        id="textFontSizeEdit"
        type="number"
        placeholder="Edit a font size"
        step="0.1"
        ref={fontSizeRef}
        defaultValue={1}
        aria-describedby="textFontSizeEditDesc"
      />
      <HiddenDescription id="textFontSizeEditDesc">Edit font size of text</HiddenDescription>

      <FormLabel htmlFor="textColorEdit">Text Color (Hex or Colour):</FormLabel>
      <InputField
        id="textColorEdit"
        type="text"
        placeholder="Enter a font color"
        ref={colorRef}
        defaultValue={'black'}
        aria-describedby="textColorEditDesc"
      />
      <HiddenDescription id="textColorEditDesc">Edit font color of text</HiddenDescription>

      <FormLabel htmlFor="textFontFamily">Font Family:</FormLabel>
      <SelectField id="textFontFamily" ref={fontFamilyRef}>
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
      </SelectField>

      <SubmitButton aria-label="save text box" onClick={handleSave}>Save Changes</SubmitButton>
    </ModalMedium>
  );
};

export default EditTextModal;
