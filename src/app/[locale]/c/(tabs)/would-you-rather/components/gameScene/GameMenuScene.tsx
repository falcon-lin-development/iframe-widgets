'use client';
import React, { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

// skeletons
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// components
import {
  Box,
  Typography,
  ThemeProvider,
  IconButton,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import WYRHeader from '../../WYRHeader.client';
import TabSkeleton, { EnimatedTabSkeleton } from '../TabSkeleton.client';

// constant
import routes from '@/routes/routes';
import assets, { ButtonID } from '@/constants';
import colors from '@/styles/colors.config';

// hooks
import { GAMESTATE, usePageState } from '../../pageStateContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import Link from 'next/link';

// const MotionBox = motion(Box);

const GameMenuScene: React.FC<{
  state: GAMESTATE;
  value: number;
  setValue: (tabId: number) => void;
}> = ({ state, value, setValue }) => {
  const {
    // const: {},
    state: { isInit, gameState },
    actions: { setGameState },
  } = usePageState();
  const { logButtonClick } = useLogEvent();
  const { navigate } = useAppRouting();

  if (!isInit) {
    return <LoadingPage loadingText="loading community data" />;
  }

  return (
    <EnimatedTabSkeleton value={value} setValue={setValue}>
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.neutralSwatch.main[10],
        }}
      >
        <Image
          src={assets.images.wyr.random.display}
          alt="Random"
          width={500}
          height={500}
          priority
        />
        <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
        <Typography variant="titleMedium" sx={{ textAlign: 'center' }}>
          Finding an inspiring question?
        </Typography>
        <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>
        <Typography variant="bodyMedium" sx={{ textAlign: 'center' }}>
          Explore freely with up to 1,000 topics here!
        </Typography>
        <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
        <Link href={routes.c.would_you_rather.random}>
          <Button
            // component="a"
            variant="contained"
            sx={{
              padding: '10px 81px',
              boxShadow: 'none',
            }}
            onClick={() => {
              // setGameState(GAMESTATE.PLAYING);
              if (gameState === GAMESTATE.INIT) {
                logButtonClick(ButtonID.would_you_rather.start_game, '');
              }

              // else if (gameState === GAMESTATE.PAUSED) {
              //   logButtonClick(ButtonID.would_you_rather.restart_game, '');
              // } else if (gameState === GAMESTATE.END) {
              //   setLastQuestionIndex(0);
              //   logButtonClick(ButtonID.would_you_rather.start_game, '');
              // }
            }}
          >
            <Typography variant="labelLarge">
              {gameState === GAMESTATE.INIT
                ? 'Start Now'
                : gameState === GAMESTATE.PAUSED
                  ? 'Resume'
                  : 'Restart'}
            </Typography>
          </Button>
        </Link>
        <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
      </Box>
    </EnimatedTabSkeleton>
  );
};

export default GameMenuScene;
