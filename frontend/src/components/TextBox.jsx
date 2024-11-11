import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const TextBoxContainer = styled.div`
  width: 100%;
  height: 100%;
  font-size: ${({ $fontSize }) => $fontSize}em;
  color: ${({ $color }) => $color};
  border: 2px solid #ccc;
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

const TextBox = ({ 
  position, 
  size, 
  fontSize, 
  color, 
  zIndex, 
  text, 
  onChange, 
  onDelete, 
  onEdit, 
  fontFamily,
  slideContainerRef  
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const containerRef = useRef(null);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [minSize, setMinSize] = useState({ minWidth: 10, minHeight: 10 });

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

  useEffect(() => {
    if (slideContainerRef.current) {
      const updateMinSize = () => {
        const parentWidth = slideContainerRef.current.offsetWidth;
        const parentHeight = slideContainerRef.current.offsetHeight;
        setMinSize({
          minWidth: parentWidth * 0.01,
          minHeight: parentHeight * 0.01
        });
      };

      updateMinSize();

      window.addEventListener('resize', updateMinSize);
      return () => window.removeEventListener('resize', updateMinSize);
    }
  }, [slideContainerRef]);

  return (
    <Rnd
      size={{ width: currentSize.width, height: currentSize.height }}
      position={{ x: currentPosition.x, y: currentPosition.y }}
      onDragStop={(e, d) => {
        const constrainedX = Math.max(0, Math.min(d.x, slideContainerRef.current.offsetWidth - currentSize.width-5));
        const constrainedY = Math.max(0, Math.min(d.y, slideContainerRef.current.offsetHeight - currentSize.height-5));
        
        setCurrentPosition({ x: constrainedX, y: constrainedY });
        onChange({ size: currentSize, position: { x: constrainedX, y: constrainedY } });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const constrainedWidth = Math.min(ref.offsetWidth, slideContainerRef.current.offsetWidth - position.x-5);
        const constrainedHeight = Math.min(ref.offsetHeight, slideContainerRef.current.offsetHeight - position.y-5);

        setCurrentSize({ width: constrainedWidth, height: constrainedHeight });
        setCurrentPosition(position);

        onChange({ size: { width: constrainedWidth, height: constrainedHeight }, position });
      }}
      bounds="parent"
      disableDragging={!isSelected}
      enableResizing={isSelected ? {
        topLeft: true,
        topRight: true,
        bottomLeft: true,
        bottomRight: true,
        top: false,
        right: false,
        bottom: false,
        left: false
      } : false}
      minWidth={minSize.minWidth}
      minHeight={minSize.minHeight}
      resizeHandleStyles={isSelected ? {
        topLeft: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', left: '0px' },
        topRight: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', right: '-4px' },
        bottomLeft: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '-4px', left: '0px' },
        bottomRight: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '-4px', right: '-4px' },
      } : {}}
      style={{ zIndex }}
    >
      <TextBoxContainer
        ref={containerRef}
        $fontSize={fontSize}
        $color={color}
        $fontFamily={fontFamily}
        onClick={handleClickInside}
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete();
        }}
        onDoubleClick={() => onEdit()}
      >
        {text}
      </TextBoxContainer>
    </Rnd>
  );
};

export default TextBox;
