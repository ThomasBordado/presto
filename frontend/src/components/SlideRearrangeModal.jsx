import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';

const SlideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-family: Arial, sans-serif;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 20px;
`;

const SlideBox = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 80px;
  height: 80px;
  font-size: 1.2em;
  cursor: pointer;
  user-select: none;
`;

const RearrangeModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const RearrangeModalContent = styled.div`
  border-radius: 8px;
  background-color: #ebebeb;
  padding: 40px;
  border-radius: 8px;
  width: 320px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  font-family: Arial, sans-serif;
  background-color: #b22222;
  width: 100%;
  color: #ffffff;
  padding: 8px 21px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #8B1A1A;
  }

  &:focus {
    outline: 2px solid white;
  }
`;

const SlideRearrangeModal = ({ slides, onClose, onRearrange }) => {
  const [orderedSlides, setOrderedSlides] = useState(slides);

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = orderedSlides.findIndex(slide => slide.id === active.id);
      const newIndex = orderedSlides.findIndex(slide => slide.id === over.id);
      const newOrder = arrayMove(orderedSlides, oldIndex, newIndex);
      setOrderedSlides(newOrder);
      onRearrange(newOrder);
    }
  };

  return (
    <RearrangeModalOverlay>
      <RearrangeModalContent>
        <FormTitle id="rearrange-title">Rearrange Slides</FormTitle>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedSlides.map(slide => slide.id)}>
            <SlideGrid data-testid="slide-grid"> {/* Added data-testid here */}
              {orderedSlides.map((slide, index) => (
                <SortableSlide key={slide.id} id={slide.id} index={index + 1} />
              ))}
            </SlideGrid>
          </SortableContext>
        </DndContext>
        <CloseButton onClick={onClose} aria-label="Close rearrange slides modal">Close</CloseButton>
      </RearrangeModalContent>
    </RearrangeModalOverlay>
  );
};

const SortableSlide = ({ id, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SlideBox
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-testid={`slide-box-${index}`}
    >
      {index}
    </SlideBox>
  );
};

export default SlideRearrangeModal;
