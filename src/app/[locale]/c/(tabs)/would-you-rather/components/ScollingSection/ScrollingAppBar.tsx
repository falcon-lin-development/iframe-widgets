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
  wyrPost: WyrPost;
  gameContext: GameStateHook;
  otherProps: ScollingSectionOtherProps;
  sx?: SxProps<Theme>;
}> = ({ opacityData, wyrPost, otherProps, gameContext, sx }) => {
  const { logButtonClick } = useLogEvent();
  const { constructPath } = useAppRouting();
  // bar info
  const TopBarheight = '52px';
  const { opacity: _opacity } = useOpacity(opacityData);

  // selection menu
  const canTryToSkipping =
    !gameContext.state.isSkipped &&
    gameContext.state.inGameState === INGAMESTATE.QUESTION;
  const TopToolMenuOptions: SelectionOption[] = useMemo(() => {
    const _options: SelectionOption[] = [];
    if (canTryToSkipping) {
      _options.push({
        title: 'Skip',
        icon: SkipForward,
        targetValue: MENU_OPTIONS.SKIP,
      });
    } else {
      if (otherProps.nextQuestion) {
        _options.push({
          title: 'Next',
          icon: SkipForward,
          targetValue: MENU_OPTIONS.NEXT,
        });
      }
    }

    // _options.push({
    //   title: 'Report',
    //   icon: MessageSquareWarning,
    //   targetValue: MENU_OPTIONS.REPORT,
    //   sx: {
    //     color: colors.accentError,
    //   }
    // });
    return _options;
  }, [canTryToSkipping]);

  // menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSelectedValue, setMenuSelectedValue] =
    useState<MENU_OPTIONS | null>(null);

  // skip reason menu
  const [isSkipSheetOpen, setIsSkipSheetOpen] = useState(false);
  const [skipReasonIndex, setSkipReasonIndex] = useState<number | null>(null);

  useEffect(() => {
    if (menuSelectedValue) {
      if (menuSelectedValue === MENU_OPTIONS.SKIP) {
        setIsSkipSheetOpen(true);
      }
      if (menuSelectedValue === MENU_OPTIONS.NEXT && otherProps.nextQuestion) {
        otherProps.nextQuestion();
      }
      setMenuSelectedValue(null);
    }
  }, [menuSelectedValue]);

  useEffect(() => {
    if (skipReasonIndex != null) {
      gameContext.actions.voteAsSkipWyrPost(
        SkipReasonOptions[skipReasonIndex].title,
      );
      if (otherProps.nextQuestion) {
        otherProps.nextQuestion();
      }
      setSkipReasonIndex(null);
    }
  }, [skipReasonIndex, gameContext.state.voteState]);

  return (
    <>
      <AppBar
        sx={{
          position: 'fixed',
          top: 0,
          background: colors.toRGBA(colors.white, _opacity),
          height: TopBarheight,
          ...sx,
        }}
        backButton={
          otherProps.backUrl ? (
            <Link href={otherProps.backUrl}>
              <BackIconButton onClick={() => {}} />
            </Link>
          ) : (
            <BackIconButton />
          )
        }
        rightMostIcon={
          <>
            <ShareButton
              shareProps={{
                logButtonClick,
                // attach domain
                url:
                  window.location.origin +
                  constructPath(routes.c.would_you_rather.detail._home, {
                    options: {
                      qid: wyrPost.postId,
                    },
                  }),
              }}
            />
            <Box sx={{ paddingRight: '8px' }} aria-label="spacer" />
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              opacity: _opacity,
            }}
          >
            <Typography
              variant="titleMedium"
              sx={{
                transform: 'translateY(2px)',
              }}
            >
              Vote
            </Typography>
            <Box sx={{ paddingLeft: '16px' }} aria-label="spacer" />
            {wyrPost.postCategory === PostCategory.sponsored && (
              <SponsoredChip />
            )}
          </Box>
        }
      />

      {/* popups / modal sheets */}
      <SectionsBottomModalSheet
        isOpen={isMenuOpen}
        setOpen={setIsMenuOpen}
        setSelectedValue={setMenuSelectedValue}
        info={{
          options: TopToolMenuOptions,
        }}
      />
      <SectionsBottomModalSheet
        isOpen={isSkipSheetOpen}
        setOpen={setIsSkipSheetOpen}
        setSelectedValue={(index: number | null) => {
          console.log('selected index: ', index);
          if (index != null) {
            setSkipReasonIndex(index);
          }
        }}
        info={{
          title: 'Skip because...',
          options: SkipReasonOptions,
        }}
      />
    </>
  );
};

export default ScrollingAppBar;
