'use client';
import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';

// Skeletons
import Sheet from 'react-modal-sheet';
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';

// hooks
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { usePageState } from './pageStateContextProvider';

// constants
import colors from '@/styles/colors.config';
import { Star, ChevronDown, Shuffle, History, User } from 'lucide-react';
import routes from '@/routes/routes';

/**
 *
 */
const wyrOptions: SelectionOption[] = [
  {
    icon: Star,
    title: 'Popular',
    targetIndex: 0,
  },
  {
    icon: Shuffle,
    title: 'Random',
    targetIndex: 1,
    // targetUrl: routes.c.would_you_rather.tabs.random,
  },
  // {
  //   icon: History,
  //   title: 'History',
  //   targetIndex: 2,
  // },
  {
    icon: User,
    title: 'Yours',
    targetIndex: 2,
  },
];

/**
 *
 * @returns
 * @description WYRHeader
 */
const WYRHeader: React.FC<{
  sx?: SxProps<Theme>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}> = ({ sx, currentIndex, setCurrentIndex }) => {
  return (
    <>
      <Box
        sx={{
          color: colors.neutralSwatch.main[10],
          ...sx,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // column
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant="titleLarge"
            component={'h1'}
            sx={{
              color: colors.neutralSwatch.main[30],
            }}
          >
            Would You Rather...
          </Typography>
          <Box sx={{ paddingTop: '8px' }}></Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row', // row
              justifyContent: 'space-between',
              alignItems: 'stretch',
              borderRadius: '8px',
              width: '100%',
              height: '32px',
            }}
          >
            <ActivitiesStatusCard />

            <SectionTab
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default WYRHeader;

/**
 *
 * @returns
 * @description ActivitiesStatusCard
 */
const ActivitiesStatusCard: React.FC = () => {
  const {
    state: { pointTrackingForWyrState },
  } = usePageState();

  // activity status
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = open ? 'popover-sheet' : undefined;

  const ActivityStatusExplanationSheet: React.FC<{
    id?: string;
    open: boolean;
    anchorEl: HTMLElement | null;
    handleClose: () => void;
  }> = ({ id, open, anchorEl, handleClose }) => {
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        style={{
          transform: 'translateY(8px)',
        }}
      >
        <Box
          sx={{
            maxWidth: '254px',
            padding: '12px 16px',
            backgroundColor: colors.primarySwatch.lavender[98],
            color: colors.neutralSwatch.main[30],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Typography
            variant="titleSmall"
            sx={{
              textAlign: 'left',
            }}
          >
            {/* ✅ Daily Task &  */}
            🔥 Streaks
          </Typography>
          {/* <Typography
            variant="bodyMedium"
            sx={{
              textAlign: 'left',
            }}
          >
            Every Mootiez can vote up to 5 questions per day. Make sure you vote
            wisely!
          </Typography> */}
          <Typography
            variant="bodyMedium"
            sx={{
              textAlign: 'left',
            }}
          >
            Vote any question to get a daily count to build your streak!
          </Typography>
          {/* <Typography
            variant="bodyMedium"
            sx={{
              textAlign: 'left',
            }}
          >
            You can get 5 new quota at 12:00 a.m. (UTC +8) daily.
          </Typography> */}
        </Box>
      </Popover>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 16px',
          border: '1px solid',
          color: colors.primarySwatch.lavender[10],
          borderRadius: '100px',
          backgroundColor: colors.primarySwatch.lavender[98],
          borderColor: colors.primarySwatch.lavender[90],
        }}
        onClick={handleClick}
        aria-describedby={id}
      >
        {pointTrackingForWyrState.fetching ? (
          <CircularProgress size={14} />
        ) : (
          <Typography
            variant="labelMedium"
            sx={{
              mixBlendMode:
                pointTrackingForWyrState.data?.getPointTrackingForWyr
                  .countUserVotedStreakDays === 0
                  ? 'luminosity'
                  : 'initial',
            }}
          >
            {/* ✅ 0/5  */}
            🔥{' '}
            {
              pointTrackingForWyrState.data?.getPointTrackingForWyr
                .countUserVotedStreakDays
            }
          </Typography>
        )}
      </Box>
      <ActivityStatusExplanationSheet
        id={id}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </>
  );
};

/**
 *
 * @returns
 * @description SectionTab
 */
const SectionTab: React.FC<{
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}> = ({ currentIndex, setCurrentIndex }) => {
  // tab navigation
  const [isOpen, setOpen] = useState(false);
  const currentOption = useMemo(() => {
    return wyrOptions[currentIndex];
  }, [currentIndex]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 10px',
          color: colors.secondarySwatch.lavender[10],
          backgroundColor: colors.secondarySwatch.lavender[90],
          borderRadius: '8px',
          gap: '8px',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {currentOption.icon && (
          <currentOption.icon
            size={16}
            style={{
              display: 'inline',
              color: colors.primarySwatch.lavender[40],
            }}
          />
        )}
        <Typography
          variant="labelLarge"
          sx={{
            fontWeight: 400,
          }}
        >
          {currentOption.title}
        </Typography>
        <ChevronDown
          size={16}
          style={{
            display: 'inline',
          }}
        />
      </Box>

      <SectionsBottomModalSheet
        isOpen={isOpen}
        setOpen={setOpen}
        setSelectedValue={setCurrentIndex}
        info={{
          // title: 'Select a section',
          options: wyrOptions,
        }}
      />
    </>
  );
};
