import { render, screen } from '@testing-library/react';
import SlideNumber from '../components/SlideNumber';
import { describe, it, expect } from 'vitest';

describe('SlideNumber Component', () => {
  it('renders correctly with the provided slide number', () => {
    const currentSlideIndex = 2;

    // Render the SlideNumber component with a specific slide index
    render(<SlideNumber currentSlideIndex={currentSlideIndex} />);

    // Check if the slide number is displayed correctly
    const slideNumberElement = screen.getByLabelText(`Slide number ${currentSlideIndex + 1}`);
    expect(slideNumberElement).toBeInTheDocument();
    expect(slideNumberElement).toHaveTextContent(currentSlideIndex + 1);
  });

  it('applies the correct styles to the component', () => {
    const currentSlideIndex = 0;

    render(<SlideNumber currentSlideIndex={currentSlideIndex} />);

    // Check if the styles are applied correctly
    const slideNumberElement = screen.getByLabelText(`Slide number ${currentSlideIndex + 1}`);
    expect(slideNumberElement).toHaveStyle({
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      fontSize: '1em',
      width: '50px',
      height: '50px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: 'white',
      padding: '5px',
      borderRadius: '4px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '500',
    });
  });

  it('increments the displayed slide number by 1', () => {
    const currentSlideIndex = 4;

    render(<SlideNumber currentSlideIndex={currentSlideIndex} />);

    // Check if the displayed slide number is incremented by 1
    const slideNumberElement = screen.getByLabelText(`Slide number ${currentSlideIndex + 1}`);
    expect(slideNumberElement).toHaveTextContent('5');
  });

  it('handles edge cases like 0 correctly', () => {
    const currentSlideIndex = 0;

    // Render the SlideNumber component with slide index 0
    render(<SlideNumber currentSlideIndex={currentSlideIndex} />);

    // Check if it correctly shows 1
    const slideNumberElement = screen.getByLabelText(`Slide number ${currentSlideIndex + 1}`);
    expect(slideNumberElement).toHaveTextContent('1');
  });
});
