import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';
import detectLang from 'lang-detector';

const FormField = styled.div`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px; 
  resize: vertical;
  padding: 8px;
  font-family: monospace;
  font-size: 1em;
`;

const AddCodeModal = ({ isOpen, onClose, onSave, code }) => {
  const { showError, ErrorDisplay } = useErrorMessage();
  const codeRef = useRef();
  const fontSizeRef = useRef();
  const widthRef = useRef();
  const heightRef = useRef();

  const handleTabPress = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = codeRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const tabSpaces = "  ";

      textarea.value = textarea.value.substring(0, start) + tabSpaces + textarea.value.substring(end);

      textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
    }
  };

  useEffect(() => {
    if (code) {
      codeRef.current.value = code.content;
      fontSizeRef.current.value = code.fontSize;
    }
  }, [code]);

  const handleAddSave = () => {
    const width = parseInt(widthRef.current.value, 10);
    const height = parseInt(heightRef.current.value, 10);
    const content = codeRef.current.value;

    if (width < 0 || width > 100 || height < 0 || height > 100) {
      showError("Width or Height must be between 0 and 100.");
      return;
    }

    let detected = detectLang(content);
    if (detected === 'C' || detected === 'C++') detected = 'c';
    else if (detected === 'JavaScript') detected = 'javascript';
    else if (detected === 'Python') detected = 'python';
    else if (detected === 'Java') detected = 'Java';
    else detected = 'plaintext';

    const newCode = {
      id: uuidv4(),
      content: content,
      fontSize: parseFloat(fontSizeRef.current.value),
      size: { width, height },
      position: { x: 0, y: 0 },
      language: detected
    };

    onSave(newCode);
    onClose();
  };

  const handleEditSave = () => {
    const content = codeRef.current.value;

    let detected = detectLang(content);
    if (detected === 'C' || detected === 'C++') detected = 'c';
    else if (detected === 'JavaScript') detected = 'javascript';
    else if (detected === 'Python') detected = 'python';
    else if (detected === 'Java') detected = 'Java';
    else detected = 'plaintext';

    const updatedCode = {
      ...code,
      content: content,
      fontSize: parseFloat(fontSizeRef.current.value),
      language: detected
    };

    onSave(updatedCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose}>
      <ErrorDisplay />
      <h3>{code ? "Edit Code" : "Add Code"}</h3>

      <FormField>
        <label>Code Block Content:</label>
        <TextArea ref={codeRef} defaultValue={code?.content || ''} onKeyDown={handleTabPress} />
      </FormField>

      <FormField>
        <label>Font Size (em):</label>
        <input type="number" step="0.1" ref={fontSizeRef} defaultValue={code?.fontSize || 1} />
      </FormField>

      {!code && (
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

      <button onClick={code ? handleEditSave : handleAddSave}>
        {code ? "Save Changes" : "Add Code"}
      </button>
    </ModalMedium>
  );
};

export default AddCodeModal;
