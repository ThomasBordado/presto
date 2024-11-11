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
  const [currentSize, setCurrentSize] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
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
          minHeight: parentHeight * 0.01,
        });
      };

      updateMinSize();

      window.addEventListener('resize', updateMinSize);
      return () => window.removeEventListener('resize', updateMinSize);
    }
  }, [slideContainerRef]);

  useEffect(() => {
    if (slideContainerRef.current && size && position) {
      const parentWidth = slideContainerRef.current.offsetWidth;
      const parentHeight = slideContainerRef.current.offsetHeight;

      const initialSizeInPixels = fromPercentageSize(size.width, size.height, parentWidth, parentHeight);
      const initialPositionInPixels = fromPercentagePosition(position.x, position.y, parentWidth, parentHeight);

      setCurrentSize(initialSizeInPixels);
      setCurrentPosition(initialPositionInPixels);
    }
  }, [slideContainerRef, size, position]);

  const toPercentageSize = (width, height, parentWidth, parentHeight) => ({
    width: (width / parentWidth) * 100,
    height: (height / parentHeight) * 100,
  });

  const fromPercentageSize = (width, height, parentWidth, parentHeight) => ({
    width: (width / 100) * parentWidth,
    height: (height / 100) * parentHeight,
  });

  const toPercentagePosition = (x, y, parentWidth, parentHeight) => ({
    x: (x / parentWidth) * 100,
    y: (y / parentHeight) * 100,
  });

  const fromPercentagePosition = (x, y, parentWidth, parentHeight) => ({
    x: (x / 100) * parentWidth,
    y: (y / 100) * parentHeight,
  });

  if (!currentSize || !currentPosition) {
    // Wait until currentSize and currentPosition are initialized
    return null;
  }

  return (
    <Rnd
      size={{ width: currentSize.width, height: currentSize.height }}
      position={{ x: currentPosition.x, y: currentPosition.y }}
      onDragStop={(e, d) => {
        const parent = slideContainerRef.current;
        const newPosition = toPercentagePosition(d.x, d.y, parent.offsetWidth, parent.offsetHeight);
        setCurrentPosition({ x: d.x, y: d.y });
        const newSize = toPercentageSize(currentSize.width, currentSize.height, parent.offsetWidth, parent.offsetHeight);
        onChange({ size: newSize, position: newPosition });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const parent = slideContainerRef.current;
        const newSize = toPercentageSize(ref.offsetWidth, ref.offsetHeight, parent.offsetWidth, parent.offsetHeight);
        const newPosition = toPercentagePosition(position.x, position.y, parent.offsetWidth, parent.offsetHeight);
        setCurrentSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setCurrentPosition(position);
        onChange({ size: newSize, position: newPosition });
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
      resizeHandleClasses={isSelected ? {
        topLeft: 'nw-resize',
        topRight: 'ne-resize',
        bottomLeft: 'sw-resize',
        bottomRight: 'se-resize',
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
