import styled from 'styled-components';

const StyledImage = styled.img`
  position: absolute;
  width: ${(props) => props.$size.width}%;
  height: ${(props) => props.$size.height}%;
  left: ${(props) => props.$position.x}%;
  top: ${(props) => props.$position.y}%;
  z-index: ${(props) => props.$zIndex};
`;

export default StyledImage;
