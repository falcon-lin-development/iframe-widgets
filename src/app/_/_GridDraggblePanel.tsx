'use client';
import interact from 'interactjs';
import { NextPage } from 'next';

// components
import { Box } from '@mui/material';
import CustomisableGrid from './_CustomisableGrid';

// hooks
import { useWidth } from '@/utils/useWidth';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';

const _useGridDraggablePanel = () => {
  const DIMENSION = [11, 6];
  const { windowWidth } = useWidth({ maxWidth: 430 });
  const GRID_WIDTH = windowWidth / DIMENSION[1];

  return {
    DIMENSION,
    GRID_WIDTH,
  };
};

const GridDraggablePanel: NextPage = () => {
  const { DIMENSION, GRID_WIDTH } = _useGridDraggablePanel();

  return (
    <>
      <Scaffold
        mainBody={
          <MainBody
            sx={{
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: GRID_WIDTH * DIMENSION[0],
                backgroundColor: 'grey',

                // @dev show grid lines as black line
                backgroundImage: `
                  linear-gradient(to right, black 1px, transparent 1px),
                  linear-gradient(to bottom, black 1px, transparent 1px)
                `,
                backgroundSize: `${100 / DIMENSION[1]}% ${100 / DIMENSION[0]}%`,
              }}
            >
              <CustomisableGrid GRID_WIDTH={GRID_WIDTH} id={1} />
            </Box>
          </MainBody>
        }
      />
      {/* <Grid /> */}
    </>
  );
};

export default GridDraggablePanel;
