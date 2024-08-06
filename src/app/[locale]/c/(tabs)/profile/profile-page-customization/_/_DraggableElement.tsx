import React, { useRef, useState } from 'react';
import { Layout } from 'react-grid-layout';

interface DraggableElementProps {
  onDrop?: (layout: Layout[], item: Layout, event: Event) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ onDrop }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const touchOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      touchOffset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !elementRef.current) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const touch = e.touches[0];
    elementRef.current.style.left = `${touch.clientX - touchOffset.current.x}px`;
    elementRef.current.style.top = `${touch.clientY - touchOffset.current.y}px`;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (!elementRef.current) return;

    // Create a fake drag event to simulate the drop
    const touch = e.changedTouches[0];
    const dropEvent = new Event('drop', { bubbles: true }) as any;
    dropEvent.clientX = touch.clientX;
    dropEvent.clientY = touch.clientY;

    // Find the element under the touch point
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    );

    // Dispatch the drop event on the element below
    if (elementBelow) {
      elementBelow.dispatchEvent(dropEvent);
    }

    // Reset position
    elementRef.current.style.left = '0px';
    elementRef.current.style.top = '0px';

    // Call the onDrop prop if provided
    if (onDrop) {
      const fakeLayout: Layout = {
        i: 'dragged-element',
        x: Math.floor(touch.clientX / 100), // Approximate grid position
        y: Math.floor(touch.clientY / 100), // Approximate grid position
        w: 1,
        h: 1,
      };
      onDrop([], fakeLayout, dropEvent);
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        padding: '10px',
        background: 'lightblue',
        touchAction: 'none',
        position: 'absolute',
        cursor: 'move',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      Drag me on mobile!
    </div>
  );
};

export default DraggableElement;
