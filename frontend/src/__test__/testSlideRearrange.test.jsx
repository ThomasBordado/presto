import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlideRearrangeModal from '../components/SlideRearrangeModal';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('SlideRearrangeModal component', () => {
  const mockOnClose = vi.fn();
  const mockOnRearrange = vi.fn();
  const slides = [
    { id: 'slide-1', content: 'Slide 1' },
    { id: 'slide-2', content: 'Slide 2' },
    { id: 'slide-3', content: 'Slide 3' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders slides in the modal correctly', () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    slides.forEach((slide, index) => {
      const slideElement = screen.getByText(index + 1);
      expect(slideElement).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onRearrange when rearranging slides', async () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    const slide1 = screen.getByText('1');
    const slide2 = screen.getByText('2');

    // Start dragging slide2 and move it to the left
    fireEvent.keyDown(slide2, { code: 'Space' });
    fireEvent.keyDown(slide2, { code: 'ArrowLeft' });
    await screen.findByText('Draggable item slide-2 was moved over droppable area slide-1.');
    fireEvent.keyDown(slide2, { code: 'Space' });

    await waitFor(() => {
      expect(mockOnRearrange).toHaveBeenCalledWith([
        { id: 'slide-2', content: 'Slide 2' },
        { id: 'slide-1', content: 'Slide 1' },
        { id: 'slide-3', content: 'Slide 3' },
      ]);
    });
  });

  it('reorders correctly when moving last slide to the first position', async () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    const slide3 = screen.getByText('3');

    // Start dragging slide3 to the first position
    fireEvent.keyDown(slide3, { code: 'Space' });
    fireEvent.keyDown(slide3, { code: 'ArrowLeft' });
    await screen.findByText('Draggable item slide-3 was moved over droppable area slide-1.');
    fireEvent.keyDown(slide3, { code: 'Space' });

    await waitFor(() => {
      expect(mockOnRearrange).toHaveBeenCalledWith([
        { id: 'slide-3', content: 'Slide 3' },
        { id: 'slide-1', content: 'Slide 1' },
        { id: 'slide-2', content: 'Slide 2' },
      ]);
    });
  });

  it('prevents reordering if no change in position occurs', async () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    const slide1 = screen.getByText('1');

    // Start dragging slide1 but do not change its position
    fireEvent.keyDown(slide1, { code: 'Space' });
    fireEvent.keyDown(slide1, { code: 'Space' });

    await waitFor(() => {
      expect(mockOnRearrange).not.toHaveBeenCalled();
    });
  });

  it('calls onClose when the Close button is clicked', () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
