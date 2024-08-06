'use client';
import { useState, useRef, useCallback } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';

interface DragEvent {
  clientX: number;
  clientY: number;
}

const useLongPress = ({
  onLongPress,
  duration,
}: {
  onLongPress: (gridId: string) => void;
  duration: number;
}) => {
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const timerRef = useRef<any>(null);

  // if the user's drag start and drag end is more than 400ms
  // and the user mouse is not moved more than 10px
  // then it is a long press
  const onDragStart = useCallback(
    (layout: Layout[], layoutItem: Layout, event: DragEvent) => {
      setDragStartTime(Date.now());
      setStartPosition({ x: event.clientX, y: event.clientY });

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set a new timer
      timerRef.current = setTimeout(() => {
        onLongPress(layoutItem.i);
      }, duration);
    },
    [onLongPress, duration],
  );

  const onDrag = useCallback(
    (layout: Layout[], layoutItem: Layout, event: DragEvent) => {
      // if the user moves the mouse, then it is not a long press
      // console.log(startPosition, { x: event.clientX, y: event.clientY });
      if (dragStartTime && startPosition) {
        if (
          !isSamePosition(startPosition, { x: event.clientX, y: event.clientY })
        ) {
          // console.log('clearing state');
          _clearState();
        }
      }
    },
    [dragStartTime, startPosition],
  );

  const onDragEnd = useCallback(
    (layout: Layout[], layoutItem: Layout, event: DragEvent) => {
      // Reset state
      _clearState();
    },
    [],
  );

  // helpers
  const isSamePosition = useCallback(
    (start: { x: number; y: number }, end: { x: number; y: number }) => {
      return start.x === end.x && start.y === end.y;
    },
    [],
  );

  const _clearState = useCallback(() => {
    setDragStartTime(null);
    setStartPosition(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, [setDragStartTime, setStartPosition, timerRef]);

  return {
    onDragStart,
    onDrag,
    onDragEnd,
  };
};

export default useLongPress;
