'use client';
import React from 'react';
import { _useOnboardingPageState } from './OnboardingFlowPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import { CircularProgress, Typography } from '@mui/material';
import colors from '@/styles/colors.config';
import AmusingFacts from '@/components/common/AmusingFacts';

const Step5Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={"While we're waiting"}
            backButton={<BackIconButton disabled={true} />}
          />
        }
        mainBody={
          <MainBody
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              color: colors.neutralSwatch.main[10],
              paddingX: '24px',
            }}
          >
            <>
              {/* <CircularProgress />
              <Typography
                variant="bodySmall"
                color={colors.neutralSwatch.main[50]}
              >
                Waiting time: 10 - 30 s
              </Typography> */}
              <AmusingFacts />
            </>
          </MainBody>
        }
      />
    </>
  );
};

export default Step5Page;
