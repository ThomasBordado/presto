import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import Logout from '../components/Logout';
import { BrowserRouter as Router } from 'react-router-dom';
import { getToken, removeToken } from '../Auth';
import config from '../../backend.config.json';

vi.mock('axios');
vi.mock('../Auth', () => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

// Helper function to wrap components in a Router for testing navigation
const renderWithRouter = (ui) => render(<Router>{ui}</Router>);

afterEach(() => {
    vi.clearAllMocks();
  });

describe('Logout Component', () => {
  
    // Check that the component renders with the expected button
  it('renders the Logout button', () => {
    renderWithRouter(<Logout />);
    expect(screen.getByLabelText(/Logout of Presto/i)).toBeInTheDocument();
  });

  // Mocking token and API response
  it('calls the logout API and redirects to the homepage on successful logout', async () => {
    
    getToken.mockReturnValue('valid-token');
    axios.post.mockResolvedValueOnce({ data: { message: 'Logged out successfully' } });

    renderWithRouter(<Logout />);
    const button = screen.getByLabelText(/Logout of Presto/i);
    fireEvent.click(button);

    // Check that the API was called with the correct endpoint and token
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${config.BACKEND_LOCAL}/admin/auth/logout`,
        {},
        { headers: { Authorization: 'Bearer valid-token' } }
      );
    });

    // Check that the token is removed and user is redirected
    expect(removeToken).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });

  // Mock the case where getToken returns null
  it('handles missing token by showing an error and preventing API call', async () => {
    getToken.mockReturnValue(null);

    // Used this to supress errors in console.
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    renderWithRouter(<Logout />);
    const button = screen.getByLabelText(/Logout of Presto/i);
    fireEvent.click(button);
  
    // Ensure no API call is made and the expected error message is logged
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error logging out:', 'No authentication token found');
    });
  
    consoleSpy.mockRestore();
  });

    // Mock the token and simulate an API failure
  it('shows an error when the logout API call fails', async () => {
    
    getToken.mockReturnValue('valid-token');
    axios.post.mockRejectedValueOnce({ message: "Logout failed" });
    console.error = vi.fn();

    renderWithRouter(<Logout />);
    const button = screen.getByLabelText(/Logout of Presto/i);
    fireEvent.click(button);

    // Verify that the API call is made and error is logged when it fails
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${config.BACKEND_LOCAL}/admin/auth/logout`,
        {},
        { headers: { Authorization: 'Bearer valid-token' } }
      );
      expect(console.error).toHaveBeenCalledWith('Error logging out:', 'Logout failed');
    });
  });
});
