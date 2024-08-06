'use client';
import interact from 'interactjs';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useWidth } from '@/utils/useWidth';

const CustomisableGrid: React.FC<{
  GRID_WIDTH: number;
  id: string | number;
}> = ({ GRID_WIDTH, id }) => {
  const _ID = `grid-snap-${id}`;
  const { windowWidthFull } = useWidth({ maxWidth: 430 });

  useEffect(() => {
    const element = document.getElementById(_ID) as HTMLElement;
    setDraggble({
      element,
      gridSize: GRID_WIDTH,
    });

    return () => {
      interact(element).unset();
    };
  }, []);

  return (
    <Box
      id={_ID}
      sx={{
        width: `${GRID_WIDTH}px`,
        aspectRatio: '1/1',
        overflow: 'hidden',
        // borderRadius: '8px',
        // padding: '20px',
        // margin: '1rem',
        backgroundColor: '#29e',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'sans-serif',
        touchAction: 'none',
        boxSizing: 'border-box',
        border: '1px solid #fff',
      }}
    >
      Grid
    </Box>
  );
};

export default CustomisableGrid;

// helpers
const setDraggble = ({
  element,
  gridSize,
}: {
  element: HTMLElement;
  gridSize: number;
}) => {
  const rect = element.getBoundingClientRect();
  const parentRect = element.parentElement!.getBoundingClientRect();
  // let x = rect.left;
  // let y = rect.top;
  let x = 0;
  let y = 0;
  console.log('rect', rect, rect.left, rect.top);
  console.log(element.parentNode);
  interact(element)
    .draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: gridSize, y: gridSize })],
          range: Infinity,
          relativePoints: [
            {
              x: 0,
              y: 0,
            },
          ],
          offset: {
            x: parentRect.left,
            y: parentRect.top,
          },
        }),
        interact.modifiers.restrict({
          restriction: element.parentNode as HTMLElement,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          // endOnly: true
        }),
      ],
      inertia: true,
    })
    .on('dragmove', function (event: any) {
      x += event.dx;
      y += event.dy;

      event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
};
