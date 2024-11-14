import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlideRearrangeModal from '../components/SlideRearrangeModal';
import { describe, it, expect, vi } from 'vitest';

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

    // Verify that the Close button is rendered
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onRearrange when rearranging slides via keyboard', async () => {
    render(
      <SlideRearrangeModal slides={slides} onClose={mockOnClose} onRearrange={mockOnRearrange} />
    );

    const slide1 = screen.getByText('1');
    const slide2 = screen.getByText('2');

    // Start dragging `slide2`
    fireEvent.keyDown(slide2, { code: 'Space' });
    fireEvent.keyDown(slide2, { code: 'ArrowLeft' });
    await screen.findByText('Draggable item slide-2 was moved over droppable area slide-1.');
    fireEvent.keyDown(slide2, { code: 'Space' });

    // Ensure that onRearrange was called with a new slide order
    await waitFor(() => {
      expect(mockOnRearrange).toHaveBeenCalled();
      expect(mockOnRearrange).toHaveBeenCalledWith([
        { id: 'slide-2', content: 'Slide 2' },
        { id: 'slide-1', content: 'Slide 1' },
        { id: 'slide-3', content: 'Slide 3' },
      ]);
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
