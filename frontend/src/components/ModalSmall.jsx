import React from 'react';
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
  z-index: 1000;
`;

const Content = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 10vh;
  height: 10vh;
  max-width: 80%;
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
  cursor: pointer;
`;

function ModalSmall({ onClose, children }) {
  return (
    <Overlay>
      <Content>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </Content>
    </Overlay>
  );
}

export default ModalSmall;