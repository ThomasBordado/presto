import { useState, useRef, useEffect } from 'react';
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
        const constrainedX = Math.max(0, Math.min(d.x, slideContainerRef.current.offsetWidth - currentSize.width - 5));
        const constrainedY = Math.max(0, Math.min(d.y, slideContainerRef.current.offsetHeight - currentSize.height - 5));

        const newPosition = convertPositionToPercentage(constrainedX, constrainedY);

        setCurrentPosition({ x: constrainedX, y: constrainedY });
        const newSize = convertSizeToPercentage(currentSize.width, currentSize.height);
        onChange({ size: newSize, position: newPosition });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const constrainedWidth = Math.min(ref.offsetWidth, slideContainerRef.current.offsetWidth - position.x - 5);
        const constrainedHeight = Math.min(ref.offsetHeight, slideContainerRef.current.offsetHeight - position.y - 5);

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
        topLeft: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', left: '0px' },
        topRight: { width: '5px', height: '5px', backgroundColor: 'black', top: '0px', right: '-4px' },
        bottomLeft: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '-4px', left: '0px' },
        bottomRight: { width: '5px', height: '5px', backgroundColor: 'black', bottom: '-4px', right: '-4px' },
      } : {}}
      style={{ zIndex: isSelected ? 500 : zIndex }}
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
        aria-label="Text Block"
      >
        {text}
      </TextBoxContainer>
    </Rnd>
  );
};

export default TextBox;
