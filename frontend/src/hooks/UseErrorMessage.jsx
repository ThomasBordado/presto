import { useState } from 'react';
import ErrorPopup from '../components/ErrorPopup';

export const useErrorMessage = () => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const hideError = () => {
    setError(null);
  };

  const ErrorDisplay = () => <ErrorPopup message={error} onClose={hideError} />;

  return { showError, ErrorDisplay };
};
