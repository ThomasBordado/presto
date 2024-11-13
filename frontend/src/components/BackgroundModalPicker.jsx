import { useState } from 'react';
import ModalMedium from './ModalMedium';
import styled from 'styled-components';

const FormField = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

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

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
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
    <ModalMedium onClose={onClose}>
      <ModalTitle>Choose Background</ModalTitle>
      <FormField>
        <FormLabel>Background Type:</FormLabel>
        <SelectField value={backgroundType} onChange={(e) => setBackgroundType(e.target.value)}>
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </SelectField>
      </FormField>

      {backgroundType === 'solid' && (
        <FormField>
          <FormLabel>Color:</FormLabel>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </FormField>
      )}

      {backgroundType === 'gradient' && (
        <>
          <FormField>
            <FormLabel>Gradient Start Color (Left/Top):</FormLabel>
            <input type="color" value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} />
          </FormField>
          <FormField>
            <FormLabel>Gradient End Color (Right/Bottom):</FormLabel>
            <input type="color" value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} />
          </FormField>
          <FormField>
            <FormLabel>Direction:</FormLabel>
            <SelectField value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)}>
              <option value="to right">Left to Right</option>
              <option value="to bottom">Top to Bottom</option>
            </SelectField>
          </FormField>
        </>
      )}

      {backgroundType === 'image' && (
        <FormField>
          <FormLabel>Image URL:</FormLabel>
          <InputField type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </FormField>
      )}

      <FormField>
        <label>
          <input type="checkbox" checked={isDefault} onChange={(e) => setDefault(e.target.checked)} />
          Set Default Background
        </label>
      </FormField>

      <SaveButton onClick={handleSave}>Save Background</SaveButton>
    </ModalMedium>
  );
};

export default BackgroundPickerModal;
