'use client';
// pages/_app.tsx
import React, { useEffect, useMemo, useState } from 'react';

// components
import { Box, Snackbar } from '@mui/material';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { Typography as _Typography } from '@mui/material';
import DisplayDefaultPicker from '../pickers/DefaultPicker.display';
import { PickerOrientation } from '../pickers/DefaultPicker';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollingAppBar from './ScrollingAppBar.public';

// constant
import colors from '@/styles/colors.config';
import { WyrPost } from '../../graphql/models/WyrPost';
import routes from '@/routes/routes';

// hooks
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import Link from 'next/link';
import useScrollingData from './useScollingData';
import ScrollingCommentSection from './ScrollingCommentSection.public';

const MotionBox = motion(Box);
const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

const ScrollingSection: React.FC<{
  wyrPost: WyrPost;
}> = ({ wyrPost }) => {
  //
  const {
    state: { scaleY, minScaleY, pickerHeight },
  } = useScrollingData();
  const { constructPath } = useAppRouting();

  // orientation and app bar color
  const orientationCriteria = 0.5;
  const isOrientationVertical = useMemo(() => {
    return scaleY >= orientationCriteria;
  }, [scaleY]);

  const onClickUrl = constructPath(routes._home_login, {
    searchParams: {
      next: constructPath(routes.c.would_you_rather.detail._home, {
        options: {
          qid: wyrPost.postId,
        },
      }),
    },
  });

  return (
    <>
      <ScrollingAppBar
        opacityData={{
          scaleY,
          orientationCriteria,
          minScaleY,
        }}
        wyrPost={wyrPost}
        sx={{
          zIndex: 2,
        }}
      />
      <Link href={onClickUrl}>
        <DisplayDefaultPicker
          wyrPost={wyrPost}
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
      </Link>
      <ScrollingCommentSection wyrPost={wyrPost} onClickUrl={onClickUrl} />
    </>
  );
};

export default ScrollingSection;

// other components
