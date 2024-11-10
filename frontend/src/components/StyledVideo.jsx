import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const StyledVideoContainer = styled.div`
  position: absolute;
  width: ${(props) => props.$size.width}%;
  height: ${(props) => props.$size.height}%;
  cursor: ${(props) => (props.isSelected ? 'move' : 'pointer')};
  z-index: ${(props) => props.$zIndex};
  border: ${(props) => (props.isSelected ? '2px solid blue' : '2px solid transparent')};
  &:hover {
    border-color: ${(props) => (props.isSelected ? 'blue' : 'red')};
  }
`;

const ResizeHandle = styled.div`
  width: 5px;
  height: 5px;
  background-color: white;
  position: absolute;
  &:hover {
    background-color: grey;
  }
`;

const StyledVideo = ({ position, size, zIndex, onPositionChange, onDelete, onEdit, children }) => {
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
      <StyledVideoContainer
        ref={containerRef}
        $size={size}
        $zIndex={zIndex}
        isSelected={isSelected}
        onClick={handleClickInside}
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete();
        }}
        onDoubleClick={() => onEdit()}
      >
        {React.cloneElement(children, { draggable: false, style: { pointerEvents: isSelected ? 'none' : 'auto' } })}
        
        {isSelected && (
          <>
            <ResizeHandle style={{ top: 0, left: 0, cursor: 'nw-resize' }} />
            <ResizeHandle style={{ top: 0, right: 0, cursor: 'ne-resize' }} />
            <ResizeHandle style={{ bottom: 0, left: 0, cursor: 'sw-resize' }} />
            <ResizeHandle style={{ bottom: 0, right: 0, cursor: 'se-resize' }} />
          </>
        )}
      </StyledVideoContainer>
    </Draggable>
  );
};

export default StyledVideo;
