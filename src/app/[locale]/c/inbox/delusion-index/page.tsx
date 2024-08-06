'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography, Grid, Button } from '@mui/material';

// Internal Project Components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import TabSection from '@/components/TabSection';
import DINotValidPage from './DINotValidPage';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import DifferenceSection from './DifferenceSection';
import ScoreSection from './ScoreSection';
import BreakdownSection from './BreakdownSection';
import DetailSection from './DetailSection';
import WrapSection from './WrapSection';

// Hooks
import useMBTIReporData from '@/hooks/useMBTIReporData';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useReadFile from '@/hooks/useReadFile';

// Utilities and Redux Features
import {
  MBTIFromFriend,
  isFriedMBTIDataValid,
  calculateDelusionIndex,
  isMBTIDataValid,
} from '@/redux/features/mbti/mbtiSlice';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets from '@/constants';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page: NextPage<Props> = ({ searchParams }) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { cachedMBTIData, reportJson } = useMBTIReporData(communityProfile);
  const dICopywritings = useReadFile(assets.mbti.dI.copywritings);
  const _mbtiFromFriend = searchParams as unknown as MBTIFromFriend;

  const dI = useMemo(() => {
    if (!cachedMBTIData || !_mbtiFromFriend) return -1;
    if (
      !isMBTIDataValid(cachedMBTIData) ||
      !isFriedMBTIDataValid(_mbtiFromFriend)
    )
      return -1;
    return calculateDelusionIndex(cachedMBTIData, _mbtiFromFriend);
  }, [cachedMBTIData, _mbtiFromFriend]);

  if (
    !searchParams ||
    !cachedMBTIData ||
    !communityProfile ||
    !_mbtiFromFriend ||
    !reportJson ||
    !dICopywritings.ready
  ) {
    <LoadingPage loadingText="Loading Delusinal index" />;
  } else if (!isFriedMBTIDataValid(_mbtiFromFriend)) {
    return <DINotValidPage />;
  }

  return (
    <Scaffold
      appbar={
        <AppBar title="Delusion Index Report" backButton={<BackIconButton />} />
      }
      mainBody={
        <MainBody
          style={{ padding: '0.5rem', color: colors.neutralSwatch.main[10] }}
        >
          <TabSection
            otherAttributes={{
              allowScrollButtonsMobile: false,
            }}
            tabs={[
              {
                label: 'Difference',
                content: (
                  <DifferenceSection
                    profile={communityProfile}
                    reportJson={reportJson}
                    copywritings={dICopywritings.fileContent!}
                    dI={dI}
                    mbti={cachedMBTIData!}
                    mbtiFromFriend={_mbtiFromFriend}
                  />
                ),
              },
              {
                label: 'Score',
                content: (
                  <ScoreSection
                    dI={dI}
                    copywritings={dICopywritings.fileContent!}
                  />
                ),
              },
              // {
              //   label: 'Breakdown',
              //   content: (
              //     <BreakdownSection
              //       cachedMBTIData={cachedMBTIData!}
              //       mbtiFromFriend={_mbtiFromFriend}
              //       profile={communityProfile}
              //     />
              //   ),
              // },
              {
                label: 'Details',
                content: (
                  <DetailSection
                    dI={dI}
                    profile={communityProfile}
                    mbtiFromFriend={_mbtiFromFriend}
                    copywritings={dICopywritings.fileContent!}
                  />
                ),
              },
              {
                label: 'Share',
                content: <WrapSection profile={communityProfile} dI={dI} />,
              },
            ]}
          />
        </MainBody>
      }
    />
  );
};

export default Page;
