import React from 'react';
import styled from 'styled-components';

const TextBox = styled.div`
  position: absolute;
  top: ${({ $position }) => $position.y}%;
  left: ${({ $position }) => $position.x}%;
  width: ${({ $size }) => $size.width}%;
  height: ${({ $size }) => $size.height}%;
  font-size: ${({ $fontSize }) => $fontSize}em;
  color: ${({ $color }) => $color};
  border: 2px solid #ccc;
  padding: 5px;
  overflow: hidden;
  text-align: left;
  line-height: 1.2;
  background-color: white;
`;

export default TextBox;