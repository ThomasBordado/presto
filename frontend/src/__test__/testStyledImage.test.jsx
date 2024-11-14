import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StyledImage from '../components/StyledImage';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('StyledImage Component', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  // Dummy parent container for the image
  const slideContainerRef = { current: { offsetWidth: 800, offsetHeight: 600 } };

  const position = { x: 0, y: 0 };
  const size = { width: 50, height: 50 };
  const src = 'image-src.jpg';
  const alt = 'Test Image';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with given props', () => {
    render(
      <StyledImage
        position={position}
        src={src}
        alt={alt}
        size={size}
        zIndex={1}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        slideContainerRef={slideContainerRef}
      />
    );

    const imageElement = screen.getByAltText(alt);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', src);
    expect(imageElement).toHaveStyle('cursor: pointer');
  });

  it('calls onDelete when right-clicked on the image', () => {
    render(
      <StyledImage
        position={position}
        src={src}
        alt={alt}
        size={size}
        zIndex={1}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        slideContainerRef={slideContainerRef}
      />
    );

    const imageElement = screen.getByAltText(alt);
    fireEvent.contextMenu(imageElement);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when double-clicked on the image', () => {
    render(
      <StyledImage
        position={position}
        src={src}
        alt={alt}
        size={size}
        zIndex={1}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        slideContainerRef={slideContainerRef}
      />
    );

    const imageElement = screen.getByAltText(alt);
    fireEvent.doubleClick(imageElement); 
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });


  it('sets a selected state when clicked', async () => {
    render(
      <StyledImage
        position={position}
        src={src}
        alt={alt}
        size={size}
        zIndex={1}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        slideContainerRef={slideContainerRef}
      />
    );

    const imageElement = screen.getByAltText(alt);
    const rndWrapper = imageElement.parentElement;
    fireEvent.click(imageElement);
    expect(rndWrapper).toHaveStyle('z-index: 500');
  });

  it('removes selected state when clicking outside', () => {
    render(
      <>
        <StyledImage
          position={position}
          src={src}
          alt={alt}
          size={size}
          zIndex={1}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
          slideContainerRef={slideContainerRef}
        />
        <div data-testid="outside-click" />
      </>
    );

    const imageElement = screen.getByAltText(alt);
    const rndWrapper = imageElement.parentElement;
    fireEvent.click(imageElement);
    fireEvent.mouseDown(screen.getByTestId('outside-click'));

    expect(rndWrapper).not.toHaveStyle('z-index: 999');
  });

  it('applies correct min size constraints', () => {
    render(
      <StyledImage
        position={position}
        src={src}
        alt={alt}
        size={size}
        zIndex={1}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        slideContainerRef={slideContainerRef}
      />
    );

    const imageElement = screen.getByAltText(alt);
    const rndWrapper = imageElement.parentElement;

    // Verify minimum size constraints are set
    expect(rndWrapper).toHaveStyle(`min-width: ${slideContainerRef.current.offsetWidth * 0.01}px`);
    expect(rndWrapper).toHaveStyle(`min-height: ${slideContainerRef.current.offsetHeight * 0.01}px`);
  });
});
