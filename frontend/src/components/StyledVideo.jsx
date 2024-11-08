import styled from 'styled-components';

const StyledVideo = styled.div`
  position: absolute;
  width: ${(props) => props.$size.width}%;
  height: ${(props) => props.$size.height}%;
  left: ${(props) => props.$position.x}%;
  top: ${(props) => props.$position.y}%;
  z-index: ${(props) => props.$zIndex};
border: 5px solid black;
`;

export default StyledVideo;