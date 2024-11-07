// AddTextModal.js
import React, { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';

const FormField = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const AddTextModal = ({ isOpen, onClose, onSave, textBox }) => {
  const textRef = useRef();
  const fontSizeRef = useRef();
  const colorRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();

  useEffect(() => {
    if (textBox) {
        textRef.current.value = textBox.text;
        fontSizeRef.current.value = textBox.fontSize;
        colorRef.current.value = textBox.color;
        widthRef.current.value = textBox.size.width;
        heightRef.current.value = textBox.size.height;
      }
  }, [textBox]);

  const handleSave = () => {
    const updatedTextBox = {
      text: textRef.current.value,
      fontSize: parseFloat(fontSizeRef.current.value),
      color: colorRef.current.value,
      size: {
        width: parseInt(widthRef.current.value, 10),
        height: parseInt(heightRef.current.value, 10),
      },
      position: textBox?.position || { x: 0, y: 0 },
    };

    onSave(updatedTextBox);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <h3>{textBox ? "Edit Text Box" : "Add Text Box"}</h3>

      <FormField>
        <label>Text Content:</label>
        <input type="text" ref={textRef} />
      </FormField>

      <FormField>
        <label>Font Size (em):</label>
        <input type="number" step="0.1" ref={fontSizeRef} />
      </FormField>

      <FormField>
        <label>Text Color (Use '#XXXXXX' for Hex or type the colour):</label>
        <input type="text" ref={colorRef} />
      </FormField>

      <FormField>
        <label>Width (%):</label>
        <input type="number" ref={widthRef} />
      </FormField>

      <FormField>
        <label>Height (%):</label>
        <input type="number" ref={heightRef} />
      </FormField>

      <button onClick={handleSave}>{textBox ? "Save Changes" : "Add Text"}</button>
    </ModalMedium>
  );
};

export default AddTextModal;
