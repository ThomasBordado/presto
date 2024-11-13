import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';

const SlideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 20px;
  background-color: #fff;
`;

const SlideBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  width: 80px;
  height: 80px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;

const RearrangeModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const RearrangeModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
`;

const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #f6656c;
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedSlides.map(slide => slide.id)}>
            <SlideGrid>
              {orderedSlides.map((slide, index) => (
                <SortableSlide key={slide.id} id={slide.id} index={index + 1} />
              ))}
            </SlideGrid>
          </SortableContext>
        </DndContext>
        <CloseButton onClick={onClose}>Close</CloseButton>
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
    <SlideBox ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {index}
    </SlideBox>
  );
};

export default SlideRearrangeModal;
