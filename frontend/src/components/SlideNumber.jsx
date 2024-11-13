import styled from 'styled-components';

const SlideNumberStyle = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 1em;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const SlideNumber = ({ currentSlideIndex }) => {
  return (
    <SlideNumberStyle>
      <div>{currentSlideIndex + 1}</div>
    </SlideNumberStyle>
  );
};

export default SlideNumber;
