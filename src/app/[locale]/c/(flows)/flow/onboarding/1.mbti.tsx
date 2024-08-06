'use client';
import React, { useState } from 'react';
import { _useOnboardingPageState } from './OnboardingFlowPage';
import Image from 'next/image';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import MessageDialog, {
  useConfirmActionMessage,
} from '@/components/dialogs/MessageDialog.client';
import {
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  Snackbar,
} from '@mui/material';
import Sheet from 'react-modal-sheet';
import CancellableTextField from '@/components/TextFields/CancellableTextField';
import { LoadingButton } from '@mui/lab';
import SurveyJsRenderer from '@/components/surveyJs/SurveyJsRenderer';

// hooks
import { CheckIcon } from 'lucide-react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useSearchParams } from 'next/navigation';

// models
import assets from '@/constants';
import { MBTI_TEST_JSON } from '@/data/db/tasks/mbti';
import {
  MBTIformId,
  calculateScores,
} from '@/app/[locale]/c/(tabs)/quizzes/tasks/mbti-test/_survey/MBTITestPage.client';
import { CompleteEvent, SurveyModel } from 'survey-core';
import colors from '@/styles/colors.config';
import { useCenterFixedPosition, useFixedPos } from '@/utils/usePosition';
import { isMobile } from 'react-device-detect';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';
import LinearProgressIndicator from '@/components/LinearProgressIndicator';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    '&.Mui-selected': {
      backgroundColor: colors.secondarySwatch.main[90],
      '&:hover': {
        backgroundColor: colors.secondarySwatch.main[90],
      },
    },
  },
  // width: "100%",
  // display: "flex",
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: '1px solid',
  borderColor: colors.neutralSwatch.main[80] + ' !important',

  borderRadius: '9999px', // Rounded corners for selected button
  padding: '8px 24px',
  width: '70px',
  textTransform: 'none',
}));

const Step1Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const { left } = useCenterFixedPosition();
  const [errorMessage, setErrorMessage] = React.useState('');
  const validateStep = () => {
    if (
      !state.state.ei ||
      !state.state.sn ||
      !state.state.tf ||
      !state.state.jp
    ) {
      setErrorMessage('MBTI is required');
      return false;
    }
    return true;
  };

  return (
    <>
      <MBTITestPage
        onBackClick={() => {
          state.actions.goBack();
        }}
        ei={state.state.ei}
        sn={state.state.sn}
        tf={state.state.tf}
        jp={state.state.jp}
        setei={state.actions.setei}
        setsn={state.actions.setsn}
        settf={state.actions.settf}
        setjp={state.actions.setjp}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        progressIndicator={
          <>
            <LinearProgressIndicator progress={Math.floor((1 / 5) * 100)} />
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
          disabled={
            !Boolean(
              state.state.ei &&
                state.state.sn &&
                state.state.tf &&
                state.state.jp,
            )
          }
          // loading={state.state.isLoading}
        >
          <Typography variant="labelLarge">Next</Typography>
        </LoadingButton>
      </Box>
    </>
  );
};

export default Step1Page;

/****************************************************
 * MBTI Test Page
 * @param param0
 * @returns
 *****************************************************/
export const MBTITestPage: React.FC<{
  onBackClick: () => void;
  ei: 'E' | 'I' | null;
  sn: 'S' | 'N' | null;
  tf: 'T' | 'F' | null;
  jp: 'J' | 'P' | null;
  setei: (ei: 'E' | 'I') => void;
  setsn: (sn: 'S' | 'N') => void;
  settf: (tf: 'T' | 'F') => void;
  setjp: (jp: 'J' | 'P') => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  progressIndicator?: React.ReactNode;
}> = ({
  onBackClick,
  ei,
  sn,
  tf,
  jp,
  setei,
  setsn,
  settf,
  setjp,
  errorMessage,
  setErrorMessage,
  progressIndicator,
}) => {
  const [isMBTITestModalOpen, setIsMBTITestModalOpen] = React.useState(false);
  const [isMBTIUpdatedSnackbarOpen, setIsMBTIUpdatedSnackbarOpen] =
    React.useState(false);

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={
              <Typography
                variant="titleMedium"
                className="tw-flex-grow tw-text-left tw-whitespace-nowrap"
                sx={{
                  transform: 'translateY(2px)',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                What's your personality type?
              </Typography>
              // 'Your personality type?'
            }
            backButton={
              <BackIconButton
                onClick={() => {
                  onBackClick && onBackClick();
                  // goBack();
                }}
              />
            }
            progressIndicator={progressIndicator}
          />
        }
        mainBody={
          <MainBody
            sx={{
              paddingX: '24px',
              justifyContent: 'center',
            }}
          >
            {/* MBTI Selection Section */}
            <>
              {/* IE */}
              <CustomToggleButtonGroup
                value={ei}
                onChange={(event, value) => value && setei(value)}
                aria-label="MBTI"
                exclusive
              >
                <CustomToggleButton value="I">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    I
                  </Typography>
                </CustomToggleButton>
                <CustomToggleButton value="E">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    E
                  </Typography>
                </CustomToggleButton>
              </CustomToggleButtonGroup>

              {/* NS */}
              <Box paddingTop={'16px'} />
              <CustomToggleButtonGroup
                value={sn}
                onChange={(event, value) => {
                  value && setsn(value);
                }}
                aria-label="MBTI"
                exclusive
              >
                <CustomToggleButton value="N">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    N
                  </Typography>
                </CustomToggleButton>
                <CustomToggleButton value="S">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    S
                  </Typography>
                </CustomToggleButton>
              </CustomToggleButtonGroup>

              {/* FT */}
              <Box paddingTop={'16px'} />
              <CustomToggleButtonGroup
                value={tf}
                onChange={(event, value) => value && settf(value)}
                aria-label="MBTI"
                exclusive
              >
                <CustomToggleButton value="F">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    F
                  </Typography>
                </CustomToggleButton>
                <CustomToggleButton value="T">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    T
                  </Typography>
                </CustomToggleButton>
              </CustomToggleButtonGroup>

              {/* JP */}
              <Box paddingTop={'16px'} />
              <CustomToggleButtonGroup
                value={jp}
                onChange={(event, value) => value && setjp(value)}
                aria-label="MBTI"
                exclusive
              >
                <CustomToggleButton value="J">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    J
                  </Typography>
                </CustomToggleButton>
                <CustomToggleButton value="P">
                  <Typography
                    variant="labelLarge"
                    color={colors.secondarySwatch.main[10]}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    P
                  </Typography>
                </CustomToggleButton>
              </CustomToggleButtonGroup>
            </>
            <Box paddingTop={'80px'} />
            <LoadingButton
              variant="text"
              onClick={() => {
                setIsMBTITestModalOpen(true);
              }}
            >
              <Typography variant="labelLarge">
                Click here if you want to do a personality test
              </Typography>
            </LoadingButton>
          </MainBody>
        }
      />

      {/* MBTI Test Modal */}
      <MBTITestModalSheet
        isOpen={isMBTITestModalOpen}
        onClose={() => {
          setIsMBTITestModalOpen(false);
        }}
        onSubmitMBTI={(ei, sn, tf, jp) => {
          setei(ei);
          setsn(sn);
          settf(tf);
          setjp(jp);
          setIsMBTIUpdatedSnackbarOpen(true);
        }}
      />

      <MessageDialog
        open={Boolean(errorMessage)}
        onIsConfirm={() => setErrorMessage('')}
        content={errorMessage}
      />
      <Snackbar
        open={isMBTIUpdatedSnackbarOpen}
        message={'You MBTI has been updated'}
        autoHideDuration={2000}
        onClose={() => setIsMBTIUpdatedSnackbarOpen(false)}
      />
    </>
  );
};

const MBTITestModalSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmitMBTI: (
    ei: 'E' | 'I',
    sn: 'S' | 'N',
    tf: 'T' | 'F',
    jp: 'J' | 'P',
  ) => void;
}> = ({ isOpen, onClose, onSubmitMBTI }) => {
  // const {searchParamsMap} = useSearchParamsMap();
  const onSubmiteCallback = async (
    sender: SurveyModel,
    options: CompleteEvent,
    formSessionId: string,
  ) => {
    const v = calculateScores(sender, formSessionId);
    console.log(v);

    onSubmitMBTI(
      v.i > v.e ? 'I' : 'E',
      v.s > v.n ? 'S' : 'N',
      v.t > v.f ? 'T' : 'F',
      v.j > v.p ? 'J' : 'P',
    );
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} detent={'full-height'} onClose={onClose}>
      <Sheet.Container
        style={{
          overflowY: 'auto',
        }}
      >
        <>
          <SurveyJsRenderer
            surveyJson={MBTI_TEST_JSON}
            formId={MBTIformId}
            onSubmiteCallback={onSubmiteCallback}
          />
        </>
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
    </Sheet>
  );
};
