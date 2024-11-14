import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ToolPanelContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  padding: 10px;
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 500;
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ToolButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 12px;
  margin: 0; 
  width: auto;
`;

const ToggleButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

const ToolContainer = styled.div`
  position: relative;
`;

const ToolPanel = ({ onAddText, onAddImage, onAddVideo, onAddCode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const togglePanel = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ToolContainer ref={panelRef}>
      <ToggleButton onClick={togglePanel}>
        {isOpen ? 'Hide Tools' : 'Show Tools'}
      </ToggleButton>

      {isOpen && (
        <ToolPanelContainer>
          <ToolButton onClick={onAddText}>Add Text Box</ToolButton>
          <ToolButton onClick={onAddImage}>Add Image</ToolButton>
          <ToolButton onClick={onAddVideo}>Add Video</ToolButton>
          <ToolButton onClick={onAddCode}>Add Code</ToolButton>
        </ToolPanelContainer>
      )}
    </ToolContainer>
  );
};

export default ToolPanel;
