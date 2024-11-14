import { render, screen, fireEvent } from '@testing-library/react';
import SlideControl from '../components/SlideContol';
import { describe, it, expect, vi } from 'vitest';

describe('SlideControl component', () => {
  const mockGoToPreviousSlide = vi.fn();
  const mockGoToNextSlide = vi.fn();
  const mockHandleCreateSlide = vi.fn();
  const mockHandleDeleteSlide = vi.fn();

  const renderSlideControl = (props) => {
    render(
      <SlideControl
        currentSlideIndex={props.currentSlideIndex}
        totalSlides={props.totalSlides}
        goToPreviousSlide={mockGoToPreviousSlide}
        goToNextSlide={mockGoToNextSlide}
        handleCreateSlide={mockHandleCreateSlide}
        handleDeleteSlide={mockHandleDeleteSlide}
      />
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all control buttons', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    // Check for previous, next, add, and delete buttons
    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '→' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Slide' })).toBeInTheDocument();
  });

  it('disables the previous button on the first slide', () => {
    renderSlideControl({ currentSlideIndex: 0, totalSlides: 3 });

    expect(screen.getByRole('button', { name: '←' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '→' })).not.toBeDisabled();
  });

  it('disables the next button on the last slide', () => {
    renderSlideControl({ currentSlideIndex: 2, totalSlides: 3 });

    expect(screen.getByRole('button', { name: '→' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '←' })).not.toBeDisabled();
  });

  it('calls goToPreviousSlide when previous button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const previousButton = screen.getByRole('button', { name: '←' });
    fireEvent.click(previousButton);

    expect(mockGoToPreviousSlide).toHaveBeenCalledTimes(1);
  });

  it('calls goToNextSlide when next button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const nextButton = screen.getByRole('button', { name: '→' });
    fireEvent.click(nextButton);

    expect(mockGoToNextSlide).toHaveBeenCalledTimes(1);
  });

  it('calls handleCreateSlide when Add Slide button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const addButton = screen.getByRole('button', { name: 'Add Slide' });
    fireEvent.click(addButton);

    expect(mockHandleCreateSlide).toHaveBeenCalledTimes(1);
  });

  it('calls handleDeleteSlide when Delete Slide button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const deleteButton = screen.getByRole('button', { name: 'Delete Slide' });
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteSlide).toHaveBeenCalledTimes(1);
  });

  it('does not call goToPreviousSlide when previous button is disabled', () => {
    renderSlideControl({ currentSlideIndex: 0, totalSlides: 3 });

    const previousButton = screen.getByRole('button', { name: '←' });
    fireEvent.click(previousButton);

    expect(mockGoToPreviousSlide).not.toHaveBeenCalled();
  });

  it('does not call goToNextSlide when next button is disabled', () => {
    renderSlideControl({ currentSlideIndex: 2, totalSlides: 3 });

    const nextButton = screen.getByRole('button', { name: '→' });
    fireEvent.click(nextButton);

    expect(mockGoToNextSlide).not.toHaveBeenCalled();
  });
});
