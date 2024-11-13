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
  padding: 30px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

function ModalSmall({ _onClose, children }) {
  return (
    <Overlay>
      <Content>
        {children}
      </Content>
    </Overlay>
  );
}

export default ModalSmall;