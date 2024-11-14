import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 15px 15px 25px;
  background-color: #b22222;
  color: #ffffff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-family: Arial, sans-serif;
  font-size: 16px;
`;

const CloseButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  line-height: 1;
`;

const ErrorPopup = ({ message, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (message) {
      closeButtonRef.current?.focus();
    }
  }, [message]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!message) return null;

  return (
    <ErrorContainer
      role="alert"
      aria-live="assertive"
      onKeyDown={handleKeyDown}
    >
      <span>{message}</span>
      <CloseButton
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close error message"
      >
        ×
      </CloseButton>
    </ErrorContainer>
  );
};

export default ErrorPopup;
