'use client';
import { NextPage } from 'next';
import React from 'react';
import Image from 'next/image';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';

// components
import {
  BottomModalGridSelectionSheet,
  GridSelectionOption,
  BottomModalGridSelectionSheetInfo,
} from '@/components/SelectionSheet/BottomModalGridSelectionSheet.client';
import { Box, Button, Typography } from '@mui/material';

// db/model
import { MBTI_TASK, MBTI_TYPE } from '@/data/db/tasks/mbti';
import { DEFAULT_TASK_IMAGE_BG } from '@/components/cards/TaskHorizCard';
import colors from '@/styles/colors.config';
import assets from '@/constants';

// hooks
import { _mbtiTestPageState, MBTI_TEST_PAGES } from './_MBTITestPage.old';
import useReadFile from '@/hooks/useReadFile';
import { useMutationUserProfile } from '@/data/graphql/hooks/useMutationUserProfile';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
// import { Tutorials } from '@/data/graphql/models/PersonaCommunityProfile';

const _useConfirmationPageState = (
  pageState: ReturnType<typeof _mbtiTestPageState>,
) => {
  const { community } = useCommunity();
  const { communityProfile, refreshProfile } = useCommunityProfile(community);
  const {
    actions: { updateProfile },
  } = useMutationUserProfile(community);
  const { currentTask: task, mbtiType } = pageState.state;
  const { setPage, setMbtiType } = pageState.actions;
  const { fileContent, ready } = useReadFile(
    assets.mbti.report[mbtiType as MBTI_TYPE],
  );

  return {
    state: {
      community,
      task,
      mbtiType,
      fileContent,
      ready,
    },
    actions: {
      setPage,
      setMbtiType,
      markCheckPoint1: async () => {
        await updateProfile({
          dataStore: {
            onboarding_flow_checkpoint: 1,
          },
        });
        refreshProfile();
      },
    },
  };
};

const MBTIConfirmationPage: React.FC<{
  pageState: ReturnType<typeof _mbtiTestPageState>;
}> = ({ pageState }) => {
  const {
    state: { task, mbtiType, fileContent },
    actions: { setPage, setMbtiType, markCheckPoint1 },
  } = _useConfirmationPageState(pageState);
  const { navigate } = useAppRouting();

  return (
    <>
      <Scaffold
        appbar={<AppBar backButton={<BackIconButton />} title={'Collect'} />}
        mainBody={
          <>
            <MainBody
              sx={{
                paddingX: '16px',
              }}
            >
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Image
                src={assets.tasks.mbti_test.mbti[mbtiType as MBTI_TYPE]}
                alt="ENFJ"
                width={254}
                height={254}
                style={{
                  borderRadius: '8px',
                  background: task.css?.background || DEFAULT_TASK_IMAGE_BG,
                }}
              />
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Typography
                variant="titleLarge"
                color={colors.neutralSwatch.main[10]}
              >
                {fileContent?.mbtiPersonality}
              </Typography>
              <Box paddingTop={'8px'} aria-label="spacer" />
              <Typography
                variant="bodyLarge"
                color={colors.neutralSwatch.main[30]}
                fontFamily={'Basier Circle'}
              >
                {fileContent?.mbtiDesc}
              </Typography>
              <Box paddingTop={'24px'} aria-label="spacer" />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  /**
                   * @dev TODO: continue from here
                   */
                  alert(`your MBTI type is  ${mbtiType}`);

                  // markCheckPoint1();
                  // update backend for attribute done

                  navigate(routes.c.quizzes.tasks.pronouns._home, {
                    searchParams: {
                      // tutorial: Tutorials.ONBOARDING,
                    },
                  });
                }}
                sx={{
                  width: '80%',
                }}
              >
                <Typography variant="labelLarge">Confirm My MBTI</Typography>
              </Button>
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Button
                variant="contained"
                onClick={() => {
                  setMbtiType(null);
                  setPage(MBTI_TEST_PAGES.do_you_know_your_mbti);
                }}
                sx={{
                  width: '80%',
                  background: colors.secondarySwatch.main[90],
                  color: colors.secondarySwatch.main[10],
                  '&:hover': {
                    background: colors.secondarySwatch.main[90],
                    color: colors.secondarySwatch.main[10],
                  },
                }}
              >
                <Typography variant="labelLarge">I am not this MBTI</Typography>
              </Button>
            </MainBody>
            {/* SelectMBTITypeBottomSheet */}
          </>
        }
      />
    </>
  );
};

export default MBTIConfirmationPage;
