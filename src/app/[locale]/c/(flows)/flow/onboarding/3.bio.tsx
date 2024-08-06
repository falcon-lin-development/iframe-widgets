'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { _useOnboardingPageState } from './OnboardingFlowPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import MessageDialog, {
  useConfirmActionMessage,
} from '@/components/dialogs/MessageDialog.client';
import { Typography, Box, TextField } from '@mui/material';
import CancellableTextField from '@/components/TextFields/CancellableTextField';
import { LoadingButton } from '@mui/lab';
import BottomSelectionButton from '@/components/buttons/BottomSelectionButton.client';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useCenterFixedPosition } from '@/utils/usePosition';

// models
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import colors from '@/styles/colors.config';
import { isMobile } from 'react-device-detect';
import NotificationPopUp from '@/components/dialogs/NotificationPopUp.client';
import assets from '@/constants';
import LinearProgressIndicator from '@/components/LinearProgressIndicator';

const Step3Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const { left } = useCenterFixedPosition();
  const [errorMessage, setErrorMessage] = React.useState('');

  const _selectedPronouns = state.state.pronouns;
  const [openPronounsNoti, setOpenPronounsNoti] = React.useState(false);

  const validateStep = () => {
    if (!state.state.bio) {
      setErrorMessage('Bio is required');
      return false;
    }
    return true;
  };

  useEffect(() => {
    /**
     * triiger MBTI Noti in 1 second
     */
    const timeout = setTimeout(() => {
      setOpenPronounsNoti(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={'Tell the world about you'}
            backButton={
              <BackIconButton
                onClick={() => {
                  state.actions.goBack();
                }}
              />
            }
            progressIndicator={
              <>
                <LinearProgressIndicator progress={Math.floor((3 / 5) * 100)} />
              </>
            }
          />
        }
        mainBody={
          <MainBody
            sx={{
              paddingX: '16px',
              justifyContent: 'center',
            }}
          >
            <TextField
              fullWidth
              required
              hiddenLabel
              type="text"
              variant="filled"
              // label="Bio"
              placeholder="Hi! I'm Alex, a travel junkie 🌍, coffee addict ☕, and sunset chaser 📸. Living life one adventure at a time! #Travel #CoffeeLover #SunsetChaser"
              value={state.state.bio}
              // setContent={(s) => state.actions.setBio(s)}
              onChange={(e) => state.actions.setBio(e.target.value)}
              sx={{
                '& .MuiInputBase-root.MuiFilledInput-root': {
                  backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                },
              }}
              maxRows={8}
              minRows={4}
              multiline
              // maxLength="120"
              inputProps={{
                maxLength: '121',
              }}
              helperText={
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                  variant="bodySmall"
                >
                  #add #hashtag
                  {state.state.bio.length > 120 && (
                    <Typography color={colors.accentError} variant="bodySmall">
                      TLDR
                    </Typography>
                  )}
                </Typography>
              }
            />
          </MainBody>
        }
      />

      {/* Floating Button */}
      <Box // bot mid floating button
        sx={{
          position: 'fixed',
          bottom: '16px',
          left: `${left}px`,
          transform: isMobile ? 'translateX(-50%)' : 'translateX(-52%)',
        }}
      >
        <LoadingButton
          variant="contained"
          onClick={() => {
            setErrorMessage('');
            if (validateStep()) {
              state.actions.goNext();
            }
          }}
          sx={{
            paddingX: '24px',
          }}
          disabled={!Boolean(state.state.bio) || state.state.bio.length > 120}
        >
          <Typography variant="labelLarge">Next</Typography>
        </LoadingButton>
      </Box>

      {/* NotificationPopUp */}
      <NotificationPopUp
        open={openPronounsNoti}
        onClose={() => {
          setOpenPronounsNoti(false);
        }}
        image={
          assets.tasks.mbti_test.pronouns[
            _selectedPronouns
              .toLowerCase()
              .replaceAll(
                '/',
                '_',
              ) as keyof typeof assets.tasks.mbti_test.pronouns
          ]
        }
        content="You Received an Attribute Badge!"
        sx={{
          position: 'fixed',
          width: '282px',
          top: '96px',
          left: `${left}px`,
          // right: '16px',
          // right: `${v}px`,
          zIndex: 100,

          // transform: isMobile ? 'translateX(-50%)' : 'translateX(-52%)',
        }}
      />
    </>
  );
};

export default Step3Page;
