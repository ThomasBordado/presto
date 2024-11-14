import { useRef, useEffect } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';
import { useErrorMessage } from '../hooks/UseErrorMessage';
import { v4 as uuidv4 } from 'uuid';
import detectLang from 'lang-detector';

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

const FormTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  resize: vertical;
  padding: 8px;
  font-family: monospace;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 5px;

  &:focus {
    outline: 2px solid #0056b3;
  }
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
    <ModalMedium onClose={onClose} aria-labelledby="addCodeBoxModal" >
      <ErrorDisplay aria-live="assertive" />
      <FormTitle id="addCodeBoxModal">{code ? "Edit Code" : "Add Code"}</FormTitle>

      <FormLabel htmlFor="codeContent">Code Block Content:</FormLabel>
      <FormTextArea
        id="codeContent"
        placeholder="Enter your code"
        ref={codeRef}
        defaultValue={code?.content || ''}
        onKeyDown={handleTabPress}
        aria-required="true"
        aria-describedby="codeContentDesc"
      />
      <HiddenDescription id="codeContentDesc">
        Enter your code. Use &quot;Tab&quot; for indentation inside the text area.
      </HiddenDescription>

      <FormLabel htmlFor="codeFontSize">Font Size (em):</FormLabel>
      <InputField
        id="codeFontSize"
        type="number"
        placeholder="Enter code font size"
        step="0.1"
        ref={fontSizeRef}
        defaultValue={code?.fontSize || 1}
        aria-describedby="codeFontSizeDesc"
      />
      <HiddenDescription id="codeFontSizeDesc">Enter code font size</HiddenDescription>

      {!code && (
        <>
          <FormLabel htmlFor="codeWidth">Width (%):</FormLabel>
          <InputField
            id="codeWidth"
            type="number"
            placeholder="Enter a code box width"
            ref={widthRef}
            defaultValue={50}
            aria-describedby="codeWidthDesc"
          />
          <HiddenDescription id="codeWidthDesc">Width of code box to be added</HiddenDescription>

          <FormLabel htmlFor="codeHeight">Height (%):</FormLabel>
          <InputField
            id="codeHeight"
            type="number"
            placeholder="Enter a code box height"
            ref={heightRef}
            defaultValue={50}
            aria-describedby="codeHeightDesc"
          />
          <HiddenDescription id="codeHeightDesc">Height of code box to be added</HiddenDescription>
        </>
      )}

      <SubmitButton onClick={code ? handleEditSave : handleAddSave}>
        {code ? "Save Changes" : "Add Code"}
      </SubmitButton>
    </ModalMedium>
  );
};

export default AddCodeModal;
