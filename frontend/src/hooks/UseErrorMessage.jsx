import React, { useState } from 'react';
import ErrorPopup from '../components/ErrorPopup';

export const useErrorMessage = () => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  const hideError = () => {
    setError(null);
  };

  const ErrorDisplay = () => <ErrorPopup message={error} onClose={hideError} />;

  return { showError, ErrorDisplay };
};
