import { useState } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';

const ModalTitle = styled.h3`
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin: 0 0 20px 0;
  text-align: center;
`;

const FormLabel = styled.label`
  font-family: Arial, sans-serif;
  color: #333;
  font-weight: bold;
  display: block;
  margin-top: 15px;
  text-align: left;
`;

const InputField = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const SelectField = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: 2px solid #0056b3;
    box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const SaveButton = styled.button`
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const BackgroundPickerModal = ({ isOpen, onClose, onSaveBackground, currentBackground, onSaveDefault }) => {
  const [backgroundType, setBackgroundType] = useState(currentBackground?.type || 'solid');
  const [color, setColor] = useState(currentBackground?.color || '#ffffff');
  const [gradientStart, setGradientStart] = useState(currentBackground?.gradient?.start || '#ffffff');
  const [gradientEnd, setGradientEnd] = useState(currentBackground?.gradient?.end || '#000000');
  const [gradientDirection, setGradientDirection] = useState(currentBackground?.gradient?.direction || 'to right');
  const [imageUrl, setImageUrl] = useState(currentBackground?.image || '');
  const [isDefault, setDefault] = useState(false);

  const handleSave = () => {
    const background = {
      type: backgroundType,
      color,
      gradient: {
        start: gradientStart,
        end: gradientEnd,
        direction: gradientDirection,
      },
      image: imageUrl,
    };

    if (isDefault) {
      onSaveDefault(background);
    } else {
      onSaveBackground(background);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalMedium onClose={onClose} aria-labelledby="backgroundPicker">
      <ModalTitle id="backgroundPicker">Choose Background</ModalTitle>

      <FormLabel htmlFor="background-type">Background Type:</FormLabel>
      <SelectField id="background-type" value={backgroundType} onChange={(e) => setBackgroundType(e.target.value)}>
        <option value="solid">Solid Color</option>
        <option value="gradient">Gradient</option>
        <option value="image">Image</option>
      </SelectField>

      {backgroundType === 'solid' && (
        <>
          <FormLabel htmlFor="solidColorBackground">Color:</FormLabel>
          <input
            id="solidColorBackground"
            type="color"
            value={color}
            aria-label="Select solid color"
            onChange={(e) => setColor(e.target.value)}
          />
        </>
      )}

      {backgroundType === 'gradient' && (
        <>
          <FormLabel htmlFor="gradientStartBackground">Gradient Start Color (Left/Top):</FormLabel>
          <input
            id="gradientStartBackground"
            type="color"
            value={gradientStart}
            aria-label="Select gradient start color"
            onChange={(e) => setGradientStart(e.target.value)}
          />

          <FormLabel htmlFor="gradientEndBackground">Gradient End Color (Right/Bottom):</FormLabel>
          <input
            id="gradientEndBackground"
            type="color"
            value={gradientEnd}
            aria-label="Select gradient end color"
            onChange={(e) => setGradientEnd(e.target.value)}
          />

          <FormLabel htmlFor="gradientDirectionBackground">Direction:</FormLabel>
          <SelectField id="gradientDirectionBackground" value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)}>
            <option value="to right">Left to Right</option>
            <option value="to bottom">Top to Bottom</option>
          </SelectField>
        </>
      )}

      {backgroundType === 'image' && (
        <>
          <FormLabel htmlFor="imageURLBackground">Image URL:</FormLabel>
          <InputField
            id="imageURLBackground"
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            aria-label="Enter image URL"
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </>
      )}

      <FormLabel htmlFor="setDefaultBackground">
        <input
          id="setDefaultBackground"
          type="checkbox"
          checked={isDefault}
          aria-label="Set as default background"
          onChange={(e) => setDefault(e.target.checked)}
        />
        Set Default Background
      </FormLabel>

      <SaveButton onClick={handleSave}>Save Background</SaveButton>
    </ModalMedium>
  );
};

export default BackgroundPickerModal;
