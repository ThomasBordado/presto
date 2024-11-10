import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  position: absolute;
  width: ${(props) => props.$size.width}%;
  height: ${(props) => props.$size.height}%;
  z-index: ${(props) => props.$zIndex};
  cursor: pointer;
  &:hover {
    border-color: #888;
  }
`;

const ImageContainer = styled.img`
  width: 100%;
  height: 100%;
`;

const ResizeHandle = styled.div`
  width: 5px;
  height: 5px;
  background-color: black;
  position: absolute;
`;

const StyledImage = ({ position, src, alt, size, zIndex, onPositionChange, onDelete, onEdit }) => {
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
      <ImageWrapper
        ref={containerRef}
        $size={size}
        $zIndex={zIndex}
        onClick={handleClickInside}
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete();
        }}
        onDoubleClick={() => onEdit()}
      >
        <ImageContainer src={src} alt={alt} draggable={false} />
        {isSelected && (
          <>
            <ResizeHandle style={{ top: 0, left: 0, cursor: 'nw-resize' }} />
            <ResizeHandle style={{ top: 0, right: 0, cursor: 'ne-resize' }} />
            <ResizeHandle style={{ bottom: 0, left: 0, cursor: 'sw-resize' }} />
            <ResizeHandle style={{ bottom: 0, right: 0, cursor: 'se-resize' }} />
          </>
        )}
      </ImageWrapper>
    </Draggable>
  );
};

export default StyledImage;
