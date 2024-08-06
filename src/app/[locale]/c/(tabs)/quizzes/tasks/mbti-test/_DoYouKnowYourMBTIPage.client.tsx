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
// import { Tutorials } from '@/data/graphql/models/PersonaCommunityProfile';
import { MBTI_TASK, MBTI_TYPE } from '@/data/db/tasks/mbti';
import { DEFAULT_TASK_IMAGE_BG } from '@/components/cards/TaskHorizCard';
import colors from '@/styles/colors.config';
import assets from '@/constants';
import routes from '@/routes/routes';

// hooks
import { _mbtiTestPageState, MBTI_TEST_PAGES } from './_MBTITestPage.old';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useSearchParams } from 'next/navigation';

const DoYouKnowYourMBTIPage: React.FC<{
  pageState: ReturnType<typeof _mbtiTestPageState>;
}> = ({ pageState }) => {
  const { currentTask: task, mbtiType } = pageState.state;
  const { setPage, setMbtiType } = pageState.actions;

  // state
  const [openMBTITypeSelection, setOpenMBTITypeSelection] =
    React.useState(false);

  // hooks
  const params = useSearchParams();
  const { navigate, constructPath } = useAppRouting();
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
                src={assets.tasks.mbti_test.mbti.ENFJ}
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
                Do you know your MBTI?
              </Typography>
              <Box paddingTop={'8px'} aria-label="spacer" />
              <Typography
                variant="bodyLarge"
                color={colors.neutralSwatch.main[30]}
                fontFamily={'Basier Circle'}
              >
                To collect your personality attribute, tell us your MBTI or take
                a quick test to get your personality type!
              </Typography>
              <Box paddingTop={'24px'} aria-label="spacer" />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (openMBTITypeSelection) return;

                  // block scrolling
                  document.body.style.overflow = 'hidden';
                  setOpenMBTITypeSelection(true);
                }}
                sx={{
                  // padding: '10px 48px',
                  width: '80%',
                }}
              >
                <Typography variant="labelLarge">I Know My MBTI</Typography>
              </Button>
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Button
                variant="contained"
                onClick={() => {
                  const url = constructPath(
                    routes.c.quizzes.tasks.mbti_test.survey,
                    {
                      searchParams: {
                        tutorial: params.get('tutorial') || '',
                      },
                    },
                  );

                  window.location.href = url; // use this to render survey js correctly
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
                <Typography variant="labelLarge">
                  Let’s Take MBTI Test
                </Typography>
              </Button>
            </MainBody>
            {/* SelectMBTITypeBottomSheet */}
            <BottomModalGridSelectionSheet
              open={openMBTITypeSelection}
              onClose={() => {
                document.body.style.overflow = 'scroll';
                setOpenMBTITypeSelection(false);
              }}
              onSelect={(value: string | number) => {
                setMbtiType(value.toString() as MBTI_TYPE);
                if (value) setPage(MBTI_TEST_PAGES.mbti_confirmation);
              }}
              selectionInfo={{
                title: 'Select',
                subtitle: 'Choose your MBTI personality type',
                options: MBTI_TYPE_OPTIONS,
              }}
            />
          </>
        }
      />
    </>
  );
};

export default DoYouKnowYourMBTIPage;

/**
 * @dev select MBTI
 */
const MBTI_TYPE_OPTIONS: GridSelectionOption[] = Object.keys(MBTI_TYPE).map(
  (key) => {
    return {
      label: key,
      value: key,
      displayItem: (
        <>
          <Image
            src={assets.tasks.mbti_test.mbti[key as MBTI_TYPE]}
            alt={key}
            fill
            sizes={'780px'}
            style={{
              background: DEFAULT_TASK_IMAGE_BG,
            }}
          />
        </>
      ),
    };
  },
);
