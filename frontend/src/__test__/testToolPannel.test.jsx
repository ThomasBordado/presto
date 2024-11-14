import { render, screen, fireEvent } from '@testing-library/react';
import ToolPanel from '../components/ToolPanel';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('ToolPanel component', () => {
  const mockOnAddText = vi.fn();
  const mockOnAddImage = vi.fn();
  const mockOnAddVideo = vi.fn();
  const mockOnAddCode = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toggle button and toggles the panel visibility', () => {
    render(
      <ToolPanel
        onAddText={mockOnAddText}
        onAddImage={mockOnAddImage}
        onAddVideo={mockOnAddVideo}
        onAddCode={mockOnAddCode}
      />
    );

    // Check if panel opens and all buttons are not visible
    expect(screen.queryByText('Add Text Box')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Image')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Video')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Code')).not.toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /show tools/i });
    fireEvent.click(toggleButton);

    // Check if panel opens and all buttons are visible
    expect(screen.getByText('Add Text Box')).toBeInTheDocument();
    expect(screen.getByText('Add Image')).toBeInTheDocument();
    expect(screen.getByText('Add Video')).toBeInTheDocument();
    expect(screen.getByText('Add Code')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByText('Add Text Box')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Image')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Video')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Code')).not.toBeInTheDocument();
  });

  it('calls the onAddText handler when the "Add Text Box" button is clicked', () => {
    render(
      <ToolPanel
        onAddText={mockOnAddText}
        onAddImage={mockOnAddImage}
        onAddVideo={mockOnAddVideo}
        onAddCode={mockOnAddCode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /show tools/i }));
    
    fireEvent.click(screen.getByText('Add Text Box'));
    expect(mockOnAddText).toHaveBeenCalledTimes(1);
  });

  it('calls the onAddImage handler when the "Add Image" button is clicked', () => {
    render(
      <ToolPanel
        onAddText={mockOnAddText}
        onAddImage={mockOnAddImage}
        onAddVideo={mockOnAddVideo}
        onAddCode={mockOnAddCode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /show tools/i }));

    fireEvent.click(screen.getByText('Add Image'));
    expect(mockOnAddImage).toHaveBeenCalledTimes(1);
  });

  it('calls the onAddVideo handler when the "Add Video" button is clicked', () => {
    render(
      <ToolPanel
        onAddText={mockOnAddText}
        onAddImage={mockOnAddImage}
        onAddVideo={mockOnAddVideo}
        onAddCode={mockOnAddCode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /show tools/i }));

    fireEvent.click(screen.getByText('Add Video'));
    expect(mockOnAddVideo).toHaveBeenCalledTimes(1);
  });

  it('calls the onAddCode handler when the "Add Code" button is clicked', () => {
    render(
      <ToolPanel
        onAddText={mockOnAddText}
        onAddImage={mockOnAddImage}
        onAddVideo={mockOnAddVideo}
        onAddCode={mockOnAddCode}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /show tools/i }));

    fireEvent.click(screen.getByText('Add Code'));
    expect(mockOnAddCode).toHaveBeenCalledTimes(1);
  });

  it('closes the panel when clicking outside', () => {
    render(
      <>
        <ToolPanel
          onAddText={mockOnAddText}
          onAddImage={mockOnAddImage}
          onAddVideo={mockOnAddVideo}
          onAddCode={mockOnAddCode}
        />
        <div data-testid="outside">Outside Element</div>
      </>
    );

    fireEvent.click(screen.getByRole('button', { name: /show tools/i }));
    expect(screen.getByText('Add Text Box')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Add Text Box')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Image')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Video')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Code')).not.toBeInTheDocument();
  });
});
