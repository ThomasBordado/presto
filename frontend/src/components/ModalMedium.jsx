import { forwardRef } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Content = styled.div`
  background-color: #ebebeb;
  padding: 40px;
  border-radius: 8px;
  width: 320px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;

  &:hover {
    color: #dc3545;
  }
`;

const ModalMedium = forwardRef(({ onClose, children }, ref) => (
  <Overlay ref={ref}>
    <Content>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      {children}
    </Content>
  </Overlay>
));

// Add displayName to the component
ModalMedium.displayName = 'ModalMedium';

export default ModalMedium;
