import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const StyledVideoContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: ${(props) => (props.$isSelected ? 'move' : 'pointer')};
  border: ${(props) => (props.$isSelected ? '3px solid red' : '3px solid transparent')};
  &:hover {
    border-color: ${(props) => (props.$isSelected ? 'red' : 'red')};
  }
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const StyledVideo = ({
  position,
  size,
  zIndex,
  onChange,
  onDelete,
  onEdit,
  slideContainerRef,
  children
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const containerRef = useRef(null);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [minSize, setMinSize] = useState({ minWidth: 10, minHeight: 10 });
  const [isInitialised, setIsInitialised] = useState(false);

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
    if (slideContainerRef?.current) {
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

  const toPercentage = (value, total) => (value / total) * 100;
  const fromPercentage = (percentage, total) => (percentage / 100) * total;

  const convertPositionToPercentage = (x, y) => {
    const parentWidth = slideContainerRef.current.offsetWidth;
    const parentHeight = slideContainerRef.current.offsetHeight;
    return {
      x: toPercentage(x, parentWidth),
      y: toPercentage(y, parentHeight),
    };
  };

  const convertSizeToPercentage = (width, height) => {
    const parentWidth = slideContainerRef.current.offsetWidth;
    const parentHeight = slideContainerRef.current.offsetHeight;
    return {
      width: toPercentage(width, parentWidth),
      height: toPercentage(height, parentHeight),
    };
  };

  const convertPositionFromPercentage = (x, y) => {
    const parentWidth = slideContainerRef.current.offsetWidth;
    const parentHeight = slideContainerRef.current.offsetHeight;
    return {
      x: fromPercentage(x, parentWidth),
      y: fromPercentage(y, parentHeight),
    };
  };

  const convertSizeFromPercentage = (width, height) => {
    const parentWidth = slideContainerRef.current.offsetWidth;
    const parentHeight = slideContainerRef.current.offsetHeight;
    return {
      width: fromPercentage(width, parentWidth),
      height: fromPercentage(height, parentHeight),
    };
  };

  useEffect(() => {
    const initialSize = convertSizeFromPercentage(size.width, size.height);
    const initialPosition = convertPositionFromPercentage(position.x, position.y);
    setCurrentSize(initialSize);
    setCurrentPosition(initialPosition);
    setIsInitialised(true);
  }, [size, position, slideContainerRef]);

  if (!isInitialised) {
    return null;
  }

  return (
    <Rnd
      size={currentSize}
      position={currentPosition}
      onDragStop={(e, d) => {
        const constrainedX = Math.max(0, Math.min(d.x, slideContainerRef.current.offsetWidth - currentSize.width - 2));
        const constrainedY = Math.max(0, Math.min(d.y, slideContainerRef.current.offsetHeight - currentSize.height - 2));

        const newPosition = convertPositionToPercentage(constrainedX, constrainedY);

        setCurrentPosition({ x: constrainedX, y: constrainedY });
        const newSize = convertSizeToPercentage(currentSize.width, currentSize.height);
        onChange({ size: newSize, position: newPosition });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const constrainedWidth = Math.min(ref.offsetWidth, slideContainerRef.current.offsetWidth - position.x - 2);
        const constrainedHeight = Math.min(ref.offsetHeight, slideContainerRef.current.offsetHeight - position.y - 2);

        const newSize = convertSizeToPercentage(constrainedWidth, constrainedHeight);
        const newPosition = convertPositionToPercentage(position.x, position.y);

        setCurrentSize({ width: constrainedWidth, height: constrainedHeight });
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
        topLeft: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', left: '0px', zIndex: zIndex + 1 },
        topRight: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', right: '0px', zIndex: zIndex + 1 },
        bottomLeft: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '0px', left: '0px', zIndex: zIndex + 1 },
        bottomRight: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '0px', right: '0px', zIndex: zIndex + 1 },
      } : {}}
      style={{ zIndex: isSelected ? 500 : zIndex }}
    >
      <StyledVideoContainer
        ref={containerRef}
        $isSelected={isSelected}
        onClick={handleClickInside}
        onContextMenu={(e) => {
          e.preventDefault();
          onDelete();
        }}
        onDoubleClick={() => onEdit()}
        aria-label="Video Block"
      >
        {React.cloneElement(children, { draggable: false, style: { pointerEvents: isSelected ? 'none' : 'auto' } })}
      </StyledVideoContainer>
    </Rnd>
  );
};

export default StyledVideo;
