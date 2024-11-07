import React, { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';

const FormField = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
`;

const EditTextModal = ({ isOpen, onClose, onSave, textBox }) => {
  const textRef = useRef();
  const fontSizeRef = useRef();
  const colorRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();
  const xPosRef = useRef();
  const yPosRef = useRef();

  useEffect(() => {
    if (textBox) {
      textRef.current.value = textBox.text;
      fontSizeRef.current.value = textBox.fontSize;
      colorRef.current.value = textBox.color;
      widthRef.current.value = textBox.size.width;
      heightRef.current.value = textBox.size.height;
      xPosRef.current.value = textBox.position?.x ?? 0;
      yPosRef.current.value = textBox.position?.y ?? 0;
    }
  }, [textBox]);

  const handleSave = () => {
    const updatedTextBox = {
      ...textBox,
      text: textRef.current.value,
      fontSize: parseFloat(fontSizeRef.current.value),
      color: colorRef.current.value,
      size: {
        width: parseInt(widthRef.current.value, 10),
        height: parseInt(heightRef.current.value, 10),
      },
      position: {
        x: parseInt(xPosRef.current.value, 10),
        y: parseInt(yPosRef.current.value, 10),
      },
    };

    onSave(updatedTextBox);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
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
        <label>Text Color (Hex):</label>
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

      <FormField>
        <label>Position X (%):</label>
        <input type="number" ref={xPosRef} min="0" max="100" />
      </FormField>

      <FormField>
        <label>Position Y (%):</label>
        <input type="number" ref={yPosRef} min="0" max="100" />
      </FormField>

      <button onClick={handleSave}>Save Changes</button>
    </ModalMedium>
  );
};

export default EditTextModal;
