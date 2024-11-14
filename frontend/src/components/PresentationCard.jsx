import styled from 'styled-components';

const PresentationCardContainer = styled.div`
  width: 100%;
  aspect-ratio: 2 / 1;
  min-width: 100px;
  background-color: #f3f3f3;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;

  &:hover {
    background-color: #e0e0e0;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.5);
    background-color: #e0e0e0;
  }
`;

const ThumbnailContainer = styled.figure`
  width: 100%;
  height: 65%;
  background-color: ${({ $thumbnail }) => ($thumbnail ? 'transparent' : '#999')};
  background-image: ${({ $thumbnail }) => ($thumbnail ? `url(${$thumbnail})` : 'none')};
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

const Info = styled.figcaption`
  padding: 8px;
  flex-grow: 1;
`;

const Title = styled.h4`
  font-size: 1rem;
  margin: 0;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin: 4px 0;
`;

const SlideCount = styled.span`
  font-size: 0.75rem;
  color: #333;
`;

const format = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

const PresentationCard = ({ name, description, slideCount, thumbnail, onClick }) => (
  <PresentationCardContainer
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex="0"
    aria-label={`Open presentation titled ${name} with description ${description} containing ${slideCount} ${slideCount === 1 ? 'slide' : 'slides'}`}
  >
    <ThumbnailContainer $thumbnail={thumbnail} />
    <Info>
      <Title>{format(name, 21)}</Title>
      {description && <Description>{format(description, 26)}</Description>}
      <SlideCount>{slideCount} Slide{slideCount !== 1 ? 's' : ''}</SlideCount>
    </Info>
  </PresentationCardContainer>
);

export default PresentationCard;
