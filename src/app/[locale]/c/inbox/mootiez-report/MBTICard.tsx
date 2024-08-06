import BackIconButton from '@/components/buttons/BackIconButton.client';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import assets, { ButtonID } from '@/constants';
import Image from 'next/image';

import { ThemeProvider } from '@mui/material';
import mootiezTheme, { themeColors } from '@/styles/mui/mootiezTheme';
import muiTheme from '@/styles/mui/muiTheme';
import colors from '@/styles/colors.config';
import MainBody from '@/components/MainBody';
import { MBTIData, getType } from '@/redux/features/mbti/mbtiSlice';
import React from 'react';
import TabSection, { TabPanel } from '@/components/TabSection';
import { Card, Box, Tab, Tabs, Grid, Typography } from '@mui/material';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import SocialShareSection from '@/app/[locale]/mbti/mootiez-report/SocialShareSection';

import CardMain from './cards/CardMain';
import CardStrength from './cards/CardStrength';
import CardWeakness from './cards/CardWeakness';
import CardExplore from './cards/CardExplore';

type MBTICardProps = {
  mbti: MBTIData;
  profileUrl: string;
  report: Record<string, any>;
  fullReport: Record<string, any>;
  profile: CommunityProfile;
};

const MBTICard: React.FC<MBTICardProps> = ({
  mbti,
  profileUrl,
  report,
  fullReport,
  profile,
}) => {
  const [value, setValue] = React.useState(0);
  return (
    <Scaffold
      sx={{
        '& footer': {
          backgroundColor: colors.toRGBA(colors.white, 0.8),
        },
      }}
      mainBody={
        <>
          <AppBar
            backButton={<BackIconButton sx={{}} />}
            title="personality report"
            style={{
              height: '45px',
            }}
          />
          <MainBody>
            <ThemeProvider theme={mootiezTheme}>
              <TabPanel index={0} value={value} tabSectionType="bottom-nav">
                <CardMain
                  id={'mbti-card-0'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                />
              </TabPanel>
              <TabPanel index={1} value={value} tabSectionType="bottom-nav">
                <CardStrength
                  id={'mbti-card-1'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={1}
                />
              </TabPanel>
              <TabPanel index={2} value={value} tabSectionType="bottom-nav">
                <CardStrength
                  id={'mbti-card-2'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={2}
                />
              </TabPanel>
              <TabPanel index={3} value={value} tabSectionType="bottom-nav">
                <CardWeakness
                  id={'mbti-card-3'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={1}
                />
              </TabPanel>
              <TabPanel index={4} value={value} tabSectionType="bottom-nav">
                <CardWeakness
                  id={'mbti-card-4'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                  fullReport={fullReport}
                  i={2}
                />
              </TabPanel>
              <TabPanel index={5} value={value} tabSectionType="bottom-nav">
                <CardExplore
                  id={'mbti-card-5'}
                  mbti={mbti}
                  profileUrl={profileUrl}
                  report={report}
                  referralCode={profile.own_referral_code}
                />
              </TabPanel>
            </ThemeProvider>
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
};

export default MBTICard;
