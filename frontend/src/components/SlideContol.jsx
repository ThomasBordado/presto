import styled from 'styled-components';

const SlideControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const CreateDeleteContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SlideControl = ({
  currentSlideIndex,
  totalSlides,
  goToPreviousSlide,
  goToNextSlide,
  handleCreateSlide,
  handleDeleteSlide
}) => {
  return (
    <SlideControlsWrapper>
      <button aria-label="previous slide" onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
        ←
      </button>
      <CreateDeleteContainer>
        <button aria-label="add slide" onClick={handleCreateSlide}>Add Slide</button>
        <button aria-label="delete slide" onClick={handleDeleteSlide}>Delete Slide</button>
      </CreateDeleteContainer>
      <button aria-label="next slide" onClick={goToNextSlide} disabled={currentSlideIndex === totalSlides - 1}>
        →
      </button>
    </SlideControlsWrapper>
  );
};

export default SlideControl;
