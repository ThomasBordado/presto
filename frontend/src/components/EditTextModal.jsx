import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';

const FormField = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
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
      <h3>Edit Text Box</h3>

      <FormField>
        <label>Text Content:</label>
        <input type="text" ref={textRef} />
      </FormField>

      <FormField>
        <label>Font Size (em):</label>
        <input type="number" step="0.1" ref={fontSizeRef} />
      </FormField>

      <FormField>
        <label>Text Color (Hex or Colour):</label>
        <input type="text" ref={colorRef} />
      </FormField>

      <FormField>
        <label>Font Family:</label>
        <select ref={fontFamilyRef}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </FormField>

      <button onClick={handleSave}>Save Changes</button>
    </ModalMedium>
  );
};

export default EditTextModal;
