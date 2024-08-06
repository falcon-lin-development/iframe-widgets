'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { _useOnboardingPageState } from './OnboardingFlowPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import { Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import BottomSelectionButton from '@/components/buttons/BottomSelectionButton.client';
import LinearProgressIndicator from '@/components/LinearProgressIndicator';
import NotificationPopUp from '@/components/dialogs/NotificationPopUp.client';

// hooks
import { useCenterFixedPosition, useFixedPos } from '@/utils/usePosition';

// models
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import colors from '@/styles/colors.config';
import { isMobile } from 'react-device-detect';
import assets from '@/constants';

const PRONOUNS_OPTIONS: SelectionOption[] = [
  { title: 'She/Her/Hers', targetValue: 'She/Her/Hers' },
  { title: 'He/Him/His', targetValue: 'He/Him/His' },
  { title: 'They/Them/Theirs', targetValue: 'They/Them/Theirs' },
  { title: 'Ze/Hir/Hirs', targetValue: 'Ze/Hir/Hirs' },
  { title: 'Xe/Xem/Xyrs', targetValue: 'Xe/Xem/Xyrs' },
  { title: 'Ver/Vir/Vis', targetValue: 'Ver/Vir/Vis' },
  { title: 'Te/Tem/Ter', targetValue: 'Te/Tem/Ter' },
  { title: 'E/Em/Eirs', targetValue: 'E/Em/Eirs' },
];

const Step2Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const { left } = useCenterFixedPosition();
  const { v } = useFixedPos({
    right: 16,
  });
  const [errorMessage, setErrorMessage] = React.useState('');
  const _selectedPronouns = state.state.pronouns;
  const _selectedMBTI = state.state.currentMBTI;
  const [openMBTIClaimedNoti, setOpenMBTIClaimedNoti] = React.useState(false);

  const validateStep = () => {
    if (!_selectedPronouns) {
      setErrorMessage('Pronouns is required');
      return false;
    }
    return true;
  };

  useEffect(() => {
    /**
     * triiger MBTI Noti in 1 second
     */
    const timeout = setTimeout(() => {
      setOpenMBTIClaimedNoti(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <PronounSeclectionPage
        selectedPronouns={_selectedPronouns}
        onSelectPronouns={state.actions.setPronouns}
        onBackClick={() => {
          state.actions.goBack();
        }}
        progressIndicator={
          <>
            <LinearProgressIndicator progress={Math.floor((2 / 5) * 100)} />
          </>
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
          disabled={!Boolean(_selectedPronouns)}
        >
          <Typography variant="labelLarge">Next</Typography>
        </LoadingButton>
      </Box>

      {/* NotificationPopUp */}
      <NotificationPopUp
        open={openMBTIClaimedNoti}
        onClose={() => {
          setOpenMBTIClaimedNoti(false);
        }}
        image={
          assets.tasks.mbti_test.mbti[
            _selectedMBTI.toUpperCase() as keyof typeof assets.tasks.mbti_test.mbti
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

export default Step2Page;

/**
 * Pronound Selection Page
 */
export const PronounSeclectionPage: React.FC<{
  selectedPronouns: string;
  onSelectPronouns: (pronouns: string) => void;
  onBackClick?: () => void;
  progressIndicator?: React.ReactNode;
}> = ({
  selectedPronouns,
  onSelectPronouns,
  onBackClick,
  progressIndicator,
}) => {
  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={<Box paddingY={'8px'}>I prefer</Box>}
            backButton={
              <BackIconButton
                onClick={() => {
                  onBackClick && onBackClick();
                }}
              />
            }
            progressIndicator={progressIndicator}
          />
        }
        mainBody={
          <MainBody
            sx={{
              paddingX: '16px',
              justifyContent: 'center',
            }}
          >
            <BottomSelectionButton
              displayText={selectedPronouns}
              placeholder="Select pronouns"
              onSelectValue={onSelectPronouns}
              selectionInfo={{
                title: 'I prefer',
                options: PRONOUNS_OPTIONS,
              }}
              sx={{
                '& .MuiInputBase-root.MuiFilledInput-root': {
                  backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                },
              }}
            />
          </MainBody>
        }
      />
    </>
  );
};
