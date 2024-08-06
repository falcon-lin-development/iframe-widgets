'use client';
// pages/_app.tsx
import React, { useEffect, useMemo, useState } from 'react';

// skeleton
import AppBar from '@/components/appbars/AppBar';
import { FadingAppbar, FadingNavbar } from '../../random/FadingAppBars';

// components
import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography as _Typography, IconButton } from '@mui/material';
import DefaultPicker, { PickerOrientation } from '../pickers/DefaultPicker';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollingAppBar from './ScrollingAppBar';
import ScrollingCommentSection from './ScrollingCommentSection';
import BottomInputBar from './BottomInputBar.client';
// constant
import colors from '@/styles/colors.config';
import { PostCategory, WyrPost } from '../../graphql/models/WyrPost';

// hooks
import {
  GAMESTATE,
  INGAMESTATE,
  GameStateHook,
} from '../gameScene/useGameState';
import useScrollingData from './useScollingData';

const MotionBox = motion(Box);
const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

export type ScrollingSectionProps = {
  wyrPost: WyrPost;
  gameContext: GameStateHook;
  bottomInputBar?: React.ReactNode;
  otherProps: ScollingSectionOtherProps;
};
export type ScollingSectionOtherProps = {
  backUrl?: string;
  nextQuestion?: () => void;
};

const ScrollingSection: React.FC<ScrollingSectionProps> = ({
  wyrPost,
  gameContext,
  // bottomInputBar,
  otherProps,
}) => {
  const {
    state: { scaleY, minScaleY, pickerHeight },
  } = useScrollingData();

  // orientation and app bar color
  const orientationCriteria = 0.5;
  const isOrientationVertical = useMemo(() => {
    return scaleY >= orientationCriteria;
  }, [scaleY]);

  return (
    <>
      <ScrollingAppBar
        opacityData={{
          scaleY,
          orientationCriteria,
          minScaleY,
        }}
        wyrPost={wyrPost}
        gameContext={gameContext}
        otherProps={otherProps}
        sx={{
          zIndex: 2,
        }}
      />
      <DefaultPicker
        key={wyrPost.postId} // for full rebuild
        wyrPost={wyrPost}
        gameContext={gameContext}
        nextQuestion={otherProps.nextQuestion}
        scaleY={scaleY}
        orientation={
          isOrientationVertical
            ? PickerOrientation.Vertical
            : PickerOrientation.Horizontal
        }
        sx={{
          height: `${pickerHeight}px`,
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      />

      <ScrollingCommentSection wyrPost={wyrPost} gameContext={gameContext} />

      <Box // fotter
        component="footer"
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          borderRadius: '8px 8px 0px 0px',
          backgroundColor: colors.primarySwatch.main[98],
          // zIndex: 10, // this would block the snackbar
        }}
        className={`tw-max-w-mobile`} // maxWidth controlled by tailwind
      >
        <BottomInputBar gameContext={gameContext} wyrPost={wyrPost} />
      </Box>
      {gameContext.state.gameState === GAMESTATE.INIT && (
        <>
          <FadingAppbar community={gameContext.state.community} />
          <FadingNavbar communityProfile={gameContext.state.communityProfile} />
        </>
      )}
    </>
  );
};

export default ScrollingSection;
