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

import { Send } from 'lucide-react';
import CardFrame from './CardFrame';

const CardExplore: React.FC<{
  id: string;
  mbti: MBTIData;
  profileUrl: string;
  report: Record<string, any>;
  referralCode: string;
}> = ({ mbti, profileUrl, report, referralCode, id }) => {
  return (
    <CardFrame
      id={id}
      bgColorStart={themeColors.purple}
      bgColorEnd={themeColors.blue}
      hasGrayOverlay={true}
      mbtiType={getType(mbti)}
      profileUrl={profileUrl}
      sx={{
        // height: 'auto',
        // maxHeight: '100%',
        minHeight: 677,
        aspectRatio: 'unset',
      }}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: '16px 16px 16px 16px',
          }}
        >
          <Typography variant="titleReport">Ask For More Feedback!</Typography>
          <Box sx={{ paddingTop: '8px' }}></Box>
          <ThemeProvider theme={muiTheme}>
            <>
              <Typography variant="bodyLarge">
                Sometimes, it helps to get a few more people's feedback on what
                they think your MBTI might be.
              </Typography>
              <Box sx={{ paddingTop: '1rem' }}></Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  // gap: '12px',
                  borderRadius: '8px',
                  padding: '12px 12px 12px 12px',
                  bgcolor: colors.primarySwatch.main[98],
                }}
              >
                <Typography
                  variant="titleLarge"
                  sx={{}}
                  color={colors.primarySwatch.main[40]}
                >
                  Share with your friends:
                </Typography>

                <SocialShareSection
                  title={
                    'Hey! \n\nCan you help me take this MBTI test as if you were me? It will help me check how delusional I am 😂'
                  }
                  url={`${process.env.SHARE_MY_TEST_TO_FRD_URL || 'https://mootiez.com/'}?referralcode=${referralCode}`}
                  iconSize={32}
                  shareAction={ButtonID.social_share.share_di}
                  copyAction={ButtonID.social_share.copy_to_clipboard_di}
                />
              </Box>
            </>
          </ThemeProvider>
          <Box sx={{ paddingTop: '8px' }}></Box>
        </Box>
      </>
    </CardFrame>
  );
};

export default CardExplore;
