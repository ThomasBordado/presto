import styled from 'styled-components';

const SlideNumberStyle = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-family: Arial, sans-serif;
  font-size: 1em;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
`;

const SlideNumber = ({ currentSlideIndex }) => {
  return (
    <SlideNumberStyle aria-label={`Slide number ${currentSlideIndex + 1}`}>
      {currentSlideIndex + 1}
    </SlideNumberStyle>
  );
};

export default SlideNumber;
