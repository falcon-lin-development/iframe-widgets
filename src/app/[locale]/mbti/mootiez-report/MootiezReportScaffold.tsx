'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// Custom hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';

// Components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import {
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Button,
  Fade,
  Grow,
  ThemeProvider,
  Box,
} from '@mui/material';
import StrengthWeaknessSection from './StrengthWeaknessSection';
import InviteDelusionIndexSurveySection from './InviteDelusionIndexSurveySection';

// App routing and utilities
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';

// constants
import assets, { ButtonID } from '@/constants';
import useMBTIReportData from '@/hooks/useMBTIReporData';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import colors from '@/styles/colors.config';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import React from 'react';
import AppBar from '@/components/appbars/AppBar';
import mootiezTheme from '@/styles/mui/mootiezTheme';
import TabSection, { TabPanel } from '@/components/TabSection';
import CardMain from '../../c/inbox/mootiez-report/cards/CardMain';
import CardStrength from '../../c/inbox/mootiez-report/cards/CardStrength';
import CardWeakness from '../../c/inbox/mootiez-report/cards/CardWeakness';
import CardExplore from '../../c/inbox/mootiez-report/cards/CardExplore';
import LoadingPage from '@/components/loadingComponents/LoadingPageTransition';

const MootiezReportScaffold: React.FC<{
  stickyAppBar?: React.ReactNode;
  inPageAppBar?: React.ReactNode;
  showEnterCommunityButton?: boolean;
}> = ({ stickyAppBar, inPageAppBar, showEnterCommunityButton = true }) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { navigate } = useAppRouting();
  const { init, reportJson, fullReportJson, mbtiType, cachedMBTIData } =
    useMBTIReportData(communityProfile);
  const { logButtonClick } = useLogEvent();
  const [value, setValue] = React.useState(0);
  const mbti = useMemo(() => cachedMBTIData, [cachedMBTIData]);
  const profileUrl = useMemo(
    () =>
      communityProfile.profile_avatar_url || assets.images.app.defaultAvatar,
    [communityProfile.profile_avatar_url],
  );
  const report = useMemo(() => reportJson, [reportJson]);
  const fullReport = useMemo(() => fullReportJson, [fullReportJson]);
  const profile = useMemo(() => communityProfile, [communityProfile]);

  if (
    !(
      cachedMBTIData &&
      reportJson &&
      fullReportJson &&
      communityProfile.community_id
    )
  ) {
    return <LoadingPage />;
  }

  return (
    <Scaffold
      sx={{
        '& footer': {
          backgroundColor: colors.toRGBA(colors.white, 0.8),
        },
      }}
      mainBody={
        <>
          {inPageAppBar}
          <MainBody>
            <ThemeProvider theme={mootiezTheme}>
              <TabPanel index={0} value={value} tabSectionType="bottom-nav">
                {mbti ? (
                  <CardMain
                    id={'mbti-card-0'}
                    mbti={mbti}
                    profileUrl={profileUrl}
                    report={report}
                    fadeIn={true}
                  />
                ) : (
                  <></>
                )}
              </TabPanel>
              <TabPanel index={1} value={value} tabSectionType="bottom-nav">
                <CardStrength
                  id={'mbti-card-1'}
                  mbti={mbti!}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={1}
                />
              </TabPanel>
              <TabPanel index={2} value={value} tabSectionType="bottom-nav">
                <CardStrength
                  id={'mbti-card-2'}
                  mbti={mbti!}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={2}
                />
              </TabPanel>
              <TabPanel index={3} value={value} tabSectionType="bottom-nav">
                <CardWeakness
                  id={'mbti-card-3'}
                  mbti={mbti!}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={1}
                />
              </TabPanel>
              <TabPanel index={4} value={value} tabSectionType="bottom-nav">
                <CardWeakness
                  id={'mbti-card-4'}
                  mbti={mbti!}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={2}
                />
              </TabPanel>
              <TabPanel index={5} value={value} tabSectionType="bottom-nav">
                <CardExplore
                  id={'mbti-card-5'}
                  mbti={mbti!}
                  profileUrl={profileUrl}
                  report={report}
                  referralCode={profile.own_referral_code}
                />
              </TabPanel>
            </ThemeProvider>
            {showEnterCommunityButton && (
              <>
                <div className="tw-pt-[2vh]" aria-label="spacer" />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    paddingX: '5rem',
                  }}
                  onClick={() => {
                    logButtonClick(
                      ButtonID.mootiez_report.enter_app,
                      'community-main-page',
                    );
                    navigate(routes.c._home);
                  }}
                >
                  Explore more
                </Button>
                <div className="tw-pt-[2vh]" aria-label="spacer" />
              </>
            )}
          </MainBody>
        </>
      }
      bottomNavbar={
        <Box>
          <TabSection
            tabs={[
              { label: 'Overview' },
              { label: 'Strengths (1/2)' },
              { label: 'Strengths (2/2)' },
              { label: 'Weaknesses (1/2)' },
              { label: 'Weaknesses (2/2)' },
              { label: 'Feedback' },
            ]}
            tabSectionType="bottom-nav"
            showContent={false}
            otherAttributes={
              {
                // scrollButtons: false
              }
            }
            valueState={[value, setValue]}
          />
        </Box>
      }
    />
  );

  // return (
  //   <>
  //     <Scaffold
  //       appbar={stickyAppBar}
  //       mainBody={
  //         <>
  //           {inPageAppBar}
  //           <MainBody
  //             style={{
  //               padding: '1rem',
  //             }}
  //           >
  //             <Fade in={true} timeout={5000}>
  //               <Card
  //                 variant="outlined"
  //                 sx={{
  //                   width: '254px',
  //                   height: '306px',
  //                   '&:hover': {
  //                     borderColor: colors.primarySwatch.main[90],
  //                     cursor: 'default',
  //                   },
  //                 }}
  //               >
  //                 {/* <ImageWithRetry
  //                   communityProfile={communityProfile}
  //                   init={init}
  //                 /> */}
  //                 <CardContent
  //                   sx={{
  //                     display: 'flex',
  //                     justifyContent: 'center',
  //                     padding: '12px', // 12px
  //                     '&:last-child': {
  //                       paddingBottom: '12px',
  //                     },
  //                   }}
  //                 >
  //                   {init ? (
  //                     <div className="title-large tw-text-neutralSwatch-10">
  //                       {mbtiType || 'Mootiez MBTI'}
  //                     </div>
  //                   ) : (
  //                     <CircularProgress size={30} />
  //                   )}
  //                 </CardContent>
  //               </Card>
  //             </Fade>

  //             {init ? (
  //               <>
  //                 <div className="tw-pt-[3vh]" aria-label="spacer" />
  //                 <div className="title-large tw-text-center tw-text-neutralSwatch-10">
  //                   {reportJson.mbtiPersonality}
  //                 </div>
  //                 <div className="tw-pt-[1vh]" aria-label="spacer" />
  //                 <div className="body-large tw-text-center tw-text-neutralSwatch-30">
  //                   {reportJson.mbtiDesc}
  //                 </div>
  //                 <div className="tw-pt-[5vh]" aria-label="spacer" />
  //                 <div className="title-large tw-text-left tw-text-neutralSwatch-30 tw-w-full">
  //                   Full Personality Report
  //                 </div>
  //                 <div className="tw-pt-[1vh]" aria-label="spacer" />
  //                 <StrengthWeaknessSection fullReportJson={fullReportJson} />
  //                 <div className="tw-pt-[4vh]" aria-label="spacer" />
  //                 <InviteDelusionIndexSurveySection
  //                   referral_code={communityProfile.own_referral_code}
  //                 />
  //                 {showEnterCommunityButton && (
  //                   <>
  //                     <div className="tw-pt-[4vh]" aria-label="spacer" />
  //                     <Button
  //                       variant="contained"
  //                       color="primary"
  //                       size="large"
  //                       sx={{
  //                         paddingX: '5rem',
  //                       }}
  //                       onClick={() => {
  //                         logButtonClick(
  //                           ButtonID.mootiez_report.enter_app,
  //                           'community-main-page',
  //                         );
  //                         navigate(routes.c._home);
  //                       }}
  //                     >
  //                       Enter App
  //                     </Button>
  //                   </>
  //                 )}
  //               </>
  //             ) : null}

  //           </MainBody>
  //         </>
  //       }
  //     />
  //   </>
  // );
};

export default MootiezReportScaffold;
