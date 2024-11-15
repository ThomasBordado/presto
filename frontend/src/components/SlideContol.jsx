import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

const SlideControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  margin: 20px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: center;
`;

const Divider = styled.span`
  padding: 0 0.5rem;
  color: #888;
  align-self: center;
`;

const StyledButton = styled.button`
  font-family: Arial, sans-serif;
  background-color: #0056b3;
  color: #ffffff;
  padding: 8px 21px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004080;
  }

  &:focus {
    outline: 2px solid #ffffff;
  }
`;

const ToggleButton = styled(StyledButton)`
  background-color: #333;
  width: 100%;
  text-align: left;
`;

const Dropdown = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  padding: 10px;
  background-color: #ebebeb;
  border-radius: 4px;
  width: 98%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 500;
`;

const Overlay = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 500;
`;

const SlideControl = ({
  currentSlideIndex,
  totalSlides,
  goToPreviousSlide,
  goToNextSlide,
  handleCreateSlide,
  handleDeleteSlide,
  onAddText,
  onAddImage,
  onAddVideo,
  onAddCode,
  openBackgroundModal,
  openRearrangeModal,
  handlePreviewClick,
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SlideControlsWrapper>
      <ButtonGroup>
        <StyledButton aria-label="add slide" onClick={handleCreateSlide}>
          Add Slide
        </StyledButton>
        <StyledButton aria-label="delete slide" onClick={handleDeleteSlide}>
          Delete Slide
        </StyledButton>
        <Divider />
      </ButtonGroup>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <ButtonGroup>
          <StyledButton
            aria-label="previous slide"
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
          >
            <FiChevronLeft />
          </StyledButton>

          <StyledButton
            aria-label="next slide"
            onClick={goToNextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
          >
            <FiChevronRight />
          </StyledButton>
        </ButtonGroup>
      </div>

      {/* Content Options Toggle */}
      <div style={{ position: 'relative', width: '59vw' }}>
        <Overlay $isOpen={isContentOpen} onClick={() => setIsContentOpen(false)} />
        <ToggleButton
          onClick={() => setIsContentOpen((prev) => !prev)}
          aria-expanded={isContentOpen}
          aria-controls="content-options"
        >
          {isContentOpen ? 'Hide Content Options' : 'Show Content Options'}
        </ToggleButton>
        <Dropdown id="content-options" $isOpen={isContentOpen}>
          <ButtonGroup>
            <StyledButton aria-label="add text" onClick={onAddText}>
              Add Text
            </StyledButton>
            <StyledButton aria-label="add image" onClick={onAddImage}>
              Add Image
            </StyledButton>
            <StyledButton aria-label="add video" onClick={onAddVideo}>
              Add Video
            </StyledButton>
            <StyledButton aria-label="add code" onClick={onAddCode}>
              Add Code
            </StyledButton>
          </ButtonGroup>
        </Dropdown>
      </div>

      {/* Slide Settings Toggle */}
      <div style={{ position: 'relative', width: '59vw' }}>
        <Overlay $isOpen={isSettingsOpen} onClick={() => setIsSettingsOpen(false)} />
        <ToggleButton
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          aria-expanded={isSettingsOpen}
          aria-controls="slide-settings"
        >
          {isSettingsOpen ? 'Hide Slide Settings' : 'Show Slide Settings'}
        </ToggleButton>
        <Dropdown id="slide-settings" $isOpen={isSettingsOpen}>
          <ButtonGroup>
            <StyledButton onClick={openBackgroundModal} aria-label="Open Background Settings">
              Background Settings
            </StyledButton>
            <StyledButton onClick={openRearrangeModal} aria-label="Rearrange Slides">
              Rearrange Slides
            </StyledButton>
            <StyledButton onClick={handlePreviewClick} aria-label="Preview Presentation">
              Preview
            </StyledButton>
          </ButtonGroup>
        </Dropdown>
      </div>
    </SlideControlsWrapper>
  );
};

export default SlideControl;
