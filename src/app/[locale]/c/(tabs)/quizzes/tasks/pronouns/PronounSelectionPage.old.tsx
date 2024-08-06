'use client';
import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import MainBody from '@/components/MainBody';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { Box, Button, Typography } from '@mui/material';

// db / model
import assets from '@/constants';
import { PRONOUNS_TASK } from '@/data/db/tasks/pronouns';
import { DEFAULT_TASK_IMAGE_BG } from '@/components/cards/TaskHorizCard';

// hooks
import { useSearchParams } from 'next/navigation';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import colors from '@/styles/colors.config';
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';

// components
import BottomSelectionButton from '@/components/buttons/BottomSelectionButton.client';

const PronounSelectionPage: NextPage = () => {
  // hooks
  const task = PRONOUNS_TASK;
  const [openPronounsSelection, setOpenPronounsSelection] =
    React.useState(false);
  const params = useSearchParams();
  const { navigate, constructPath } = useAppRouting();

  return (
    <>
      <Scaffold
        appbar={<AppBar backButton={<BackIconButton />} />}
        mainBody={
          <>
            <MainBody
              sx={{
                paddingX: '16px',
              }}
            >
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Image
                src={assets.tasks.mbti_test.pronouns.e_em_eirs}
                alt="ENFJ"
                width={254}
                height={254}
                style={{
                  borderRadius: '8px',
                  aspectRatio: '1/1',
                  objectFit: 'contain',
                  background: task.css?.background || DEFAULT_TASK_IMAGE_BG,
                }}
              />
              <Box paddingTop={'16px'} aria-label="spacer" />
              <Typography
                variant="titleLarge"
                color={colors.neutralSwatch.main[10]}
              >
                How would you describe yourself?
              </Typography>
              <Box paddingTop={'24px'} aria-label="spacer" />
              <BottomSelectionButton
                onSelectValue={(value: string) => {
                  console.log(value);
                }}
                selectionInfo={{
                  options: PRONOUNS_OPTIONS,
                  title: 'I am...',
                }}
                displayText="Select Pronouns"
              />
              <Box paddingTop={'24px'} aria-label="spacer" />

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // block scrolling
                }}
                sx={{
                  // padding: '10px 48px',
                  width: '80%',
                }}
              >
                <Typography variant="labelLarge">
                  Confirm and Collect
                </Typography>
              </Button>
              <Box paddingTop={'16px'} aria-label="spacer" />
            </MainBody>
          </>
        }
      />
    </>
  );
};

export default PronounSelectionPage;

/**
 * @dev other components
She/her/hers
He/him/his
They/them/theirs
Ze/hir/hirs
Xe/xem/xyrs
Ver/vir/vis
Te/tem/ter
E/em/eirs
*/

const PRONOUNS_OPTIONS: SelectionOption[] = [
  {
    id: '1',
    title: 'She/her/hers',
    targetValue: 'She/her/hers',
  },
  {
    id: '2',
    title: 'He/him/his',
    targetValue: 'He/him/his',
  },
  {
    id: '3',
    title: 'They/them/theirs',
    targetValue: 'They/them/theirs',
  },
  {
    id: '4',
    title: 'Ze/hir/hirs',
    targetValue: 'Ze/hir/hirs',
  },
  {
    id: '5',
    title: 'Xe/xem/xyrs',
    targetValue: 'Xe/xem/xyrs',
  },
  {
    id: '6',
    title: 'Ver/vir/vis',
    targetValue: 'Ver/vir/vis',
  },
  {
    id: '7',
    title: 'Te/tem/ter',
    targetValue: 'Te/tem/ter',
  },
  {
    id: '8',
    title: 'E/em/eirs',
    targetValue: 'E/em/eirs',
  },
];
