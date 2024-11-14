import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTextModal from '../components/AddTextModal';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

describe('AddTextModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });


  it('renders the modal with all fields when isOpen is true', () => {
    render(<AddTextModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Check if the modal and form elements are present
    expect(screen.getByText(/Add Text Box/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Text Content:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Font Size \(em\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Text Color \(Hex or Colour\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Width \(%\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height \(%\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Font Family:/i)).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    render(<AddTextModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.queryByText(/Add Text Box/i)).not.toBeInTheDocument();
  });

  it('shows the error message for 5 seconds when width or height is out of range', async () => {
    render(<AddTextModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Input invalid width and height values
    fireEvent.change(screen.getByLabelText(/Width \(%\):/i), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText(/Height \(%\):/i), { target: { value: '-10' } });

    fireEvent.click(screen.getByText('Add Text'));

    await waitFor(() => {
      expect(screen.getByText('Width or Height is not between 0 and 100')).toBeInTheDocument();
    });

    // Check if the error message disappears after 5 seconds
    await waitFor(
      () => {
        expect(screen.queryByText('Width or Height is not between 0 and 100')).not.toBeInTheDocument();
      },
      { timeout: 6000 }
    );

    // Ensure onSave was not called
    expect(mockOnSave).not.toHaveBeenCalled();
  }, 10000);

  it('calls onSave with correct values when form inputs are valid', () => {
    render(<AddTextModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Text Content:/i), { target: { value: 'Sample Text' } });
    fireEvent.change(screen.getByLabelText(/Font Size \(em\):/i), { target: { value: '1.5' } });
    fireEvent.change(screen.getByLabelText(/Text Color \(Hex or Colour\):/i), { target: { value: '#ff5733' } });
    fireEvent.change(screen.getByLabelText(/Width \(%\):/i), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText(/Height \(%\):/i), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText(/Font Family:/i), { target: { value: 'Arial' } });

    fireEvent.click(screen.getByText('Add Text'));

    // Ensure onSave is called with expected text box data
    expect(mockOnSave).toHaveBeenCalledWith({
      id: expect.any(String),
      text: 'Sample Text',
      fontSize: 1.5,
      color: '#ff5733',
      fontFamily: 'Arial',
      size: { width: 80, height: 60 },
      position: { x: 0, y: 0 }
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('retains default values for font size, color, width, and height', () => {
    render(<AddTextModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    // Check default values for these inputs
    expect(screen.getByLabelText(/Font Size \(em\):/i)).toHaveValue(1);
    expect(screen.getByLabelText(/Text Color \(Hex or Colour\):/i)).toHaveValue('black');
    expect(screen.getByLabelText(/Width \(%\):/i)).toHaveValue(50);
    expect(screen.getByLabelText(/Height \(%\):/i)).toHaveValue(50);
  });
}, 10000);
