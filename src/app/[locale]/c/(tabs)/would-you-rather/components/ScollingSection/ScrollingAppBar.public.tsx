'use client';
// pages/_app.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// skeleton
import AppBar from '@/components/appbars/AppBar';

// components
import { Box, Typography as _Typography, IconButton } from '@mui/material';
import { SxProps, Theme, styled } from '@mui/material/styles';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { MoreHorizontal, SkipForward } from 'lucide-react';
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import SponsoredChip from '../SponsorChip';

// utils
import ShareButton, {
  shareOrCopy,
} from '@/components/buttons/ShareButton.client';

// constant
import colors from '@/styles/colors.config';
import { PostCategory, WyrPost } from '../../graphql/models/WyrPost';
import routes from '@/routes/routes';
import {
  MENU_OPTIONS,
  SkipReasonOptions,
} from './ScrollingSectionSelectionOptions';
import { ScollingSectionOtherProps } from './ScrollingSection';

// hooks
import { INGAMESTATE, GameStateHook } from '../gameScene/useGameState';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import useScrollingData, {
  useOpacity,
  useOpacityProps,
} from './useScollingData';

const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

const ScrollingAppBar: React.FC<{
  opacityData: useOpacityProps;
  sx?: SxProps<Theme>;
  wyrPost: WyrPost;
}> = ({ opacityData, wyrPost, sx }) => {
  const { constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  // bar info
  const TopBarheight = '52px';
  const { opacity: _opacity } = useOpacity(opacityData);

  // selection menu
  const TopToolMenuOptions: SelectionOption[] = [];

  // menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSelectedValue, setMenuSelectedValue] =
    useState<MENU_OPTIONS | null>(null);

  // useEffect(() => {
  //   if (menuSelectedValue) {
  //   }
  // }, [menuSelectedValue]);

  return (
    <>
      <AppBar
        sx={{
          position: 'fixed',
          top: 0,
          background: colors.toRGBA(colors.white, _opacity),
          zIndex: 1,
          ...sx,
        }}
        rightMostIcon={
          <>
            <ShareButton
              shareProps={{
                logButtonClick,
                url: constructPath(routes.c.would_you_rather.detail._home, {
                  options: {
                    qid: wyrPost.postId,
                  },
                }),
              }}
            />
            <IconButton
              onClick={() => {
                setIsMenuOpen(true);
              }}
            >
              <MoreHorizontal />
            </IconButton>
          </>
        }
        className="tw-max-w-mobile"
        title={
          <Typography
            variant="titleMedium"
            sx={{
              opacity: _opacity,
            }}
          >
            Vote
          </Typography>
        }
      />
      <SectionsBottomModalSheet
        isOpen={isMenuOpen}
        setOpen={setIsMenuOpen}
        setSelectedValue={setMenuSelectedValue}
        info={{
          options: TopToolMenuOptions,
        }}
      />
    </>
  );
};

export default ScrollingAppBar;
