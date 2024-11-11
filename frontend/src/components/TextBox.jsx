import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const TextBoxContainer = styled.div`
  position: absolute;
  width: ${({ $size }) => $size.width}%;
  height: ${({ $size }) => $size.height}%;
  font-size: ${({ $fontSize }) => $fontSize}em;
  color: ${({ $color }) => $color};
  z-index: ${({ $zIndex }) => $zIndex};
  border: 2px solid #ccc;
  padding: 5px;
  overflow: hidden;
  text-align: left;
  line-height: 1.2;
  background-color: white;
  cursor: pointer;
  font-family: ${({ $fontFamily }) => $fontFamily};

  &:hover {
    border-color: #888;
  }
`;

const ResizeHandle = styled.div`
  width: 5px;
  height: 5px;
  background-color: black;
  position: absolute;
`;

const TextBox = ({ position, size, fontSize, color, zIndex, text, onPositionChange, onDelete, onEdit, fontFamily }) => {
  const [isSelected, setIsSelected] = useState(false);
  const containerRef = useRef(null);

  const handleClickInside = (e) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStop = (e, data) => {
    onPositionChange({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      defaultPosition={{ x: position.x, y: position.y }}
      onStop={handleStop}
      bounds="parent"
      disabled={!isSelected}
    >
      <TextBoxContainer
        ref={containerRef}
        $size={size}
        $fontSize={fontSize}
        $color={color}
        $zIndex={zIndex}
        $fontFamily={fontFamily}
        onClick={handleClickInside}
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete();
        }}
        onDoubleClick={() => onEdit()}
      >
        {text}
        {isSelected && (
          <>
            <ResizeHandle style={{ top: 0, left: 0, cursor: 'nw-resize' }} />
            <ResizeHandle style={{ top: 0, right: 0, cursor: 'ne-resize' }} />
            <ResizeHandle style={{ bottom: 0, left: 0, cursor: 'sw-resize' }} />
            <ResizeHandle style={{ bottom: 0, right: 0, cursor: 'se-resize' }} />
          </>
        )}
      </TextBoxContainer>
    </Draggable>
  );
};

export default TextBox;
