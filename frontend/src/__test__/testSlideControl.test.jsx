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
  
    // Check for previous, next, add, and delete buttons using aria-label
    expect(screen.getByRole('button', { name: 'previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'next slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'add slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'delete slide' })).toBeInTheDocument();
  });  

  it('disables the previous button on the first slide', () => {
    renderSlideControl({ currentSlideIndex: 0, totalSlides: 3 });

    expect(screen.getByRole('button', { name: 'previous slide' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'next slide' })).not.toBeDisabled();
  });

  it('disables the next button on the last slide', () => {
    renderSlideControl({ currentSlideIndex: 2, totalSlides: 3 });

    expect(screen.getByRole('button', { name: 'next slide' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'previous slide' })).not.toBeDisabled();
  });

  it('calls goToPreviousSlide when previous button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const previousButton = screen.getByRole('button', { name: 'previous slide' });
    fireEvent.click(previousButton);

    expect(mockGoToPreviousSlide).toHaveBeenCalledTimes(1);
  });

  it('calls goToNextSlide when next button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const nextButton = screen.getByRole('button', { name: 'next slide' });
    fireEvent.click(nextButton);

    expect(mockGoToNextSlide).toHaveBeenCalledTimes(1);
  });

  it('calls handleCreateSlide when Add Slide button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const addButton = screen.getByRole('button', { name: 'add slide' });
    fireEvent.click(addButton);

    expect(mockHandleCreateSlide).toHaveBeenCalledTimes(1);
  });

  it('calls handleDeleteSlide when Delete Slide button is clicked', () => {
    renderSlideControl({ currentSlideIndex: 1, totalSlides: 3 });

    const deleteButton = screen.getByRole('button', { name: 'delete slide' });
    fireEvent.click(deleteButton);

    expect(mockHandleDeleteSlide).toHaveBeenCalledTimes(1);
  });

  it('does not call goToPreviousSlide when previous button is disabled', () => {
    renderSlideControl({ currentSlideIndex: 0, totalSlides: 3 });

    const previousButton = screen.getByRole('button', { name: 'previous slide' });
    fireEvent.click(previousButton);

    expect(mockGoToPreviousSlide).not.toHaveBeenCalled();
  });

  it('does not call goToNextSlide when next button is disabled', () => {
    renderSlideControl({ currentSlideIndex: 2, totalSlides: 3 });

    const nextButton = screen.getByRole('button', { name: 'next slide' });
    fireEvent.click(nextButton);

    expect(mockGoToNextSlide).not.toHaveBeenCalled();
  });
});
