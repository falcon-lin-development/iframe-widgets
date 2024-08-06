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

const CardStrength: React.FC<{
  mbti: MBTIData;
  profileUrl: string;
  report: Record<string, any>;
  fullReport: Record<string, any>;
  i: number;
  id: string;
}> = ({ mbti, profileUrl, report, i, fullReport, id }) => {
  const _PropSection: React.FC<{
    title: string;
    content: string;
  }> = ({ title, content }) => {
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          <Typography variant="labelReport">
            {title}
            {/* Uncomfortable with Unconventional Situations */}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="bodyReport"
            sx={{
              overflowWrap: 'auto',
              textAlign: 'left',
            }}
          >
            {content.split('.')[0]}.
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <CardFrame
      id={id}
      bgColorStart={i == 1 ? themeColors.blue : themeColors.yellow}
      bgColorEnd={i == 1 ? themeColors.yellow : themeColors.pink}
      hasGrayOverlay={false}
      mbtiType={getType(mbti)}
      profileUrl={profileUrl}
    >
      <>
        <Grid
          container
          sx={{
            color: i == 1 ? colors.neutralSwatch.main[10] : 'white',
          }}
        >
          <Grid
            item
            xs={6}
            sx={{
              padding: '16px 16px 0px 16px',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            <Typography variant="subtitleReport">STRENGTHS</Typography>
            <Box
              sx={{
                width: '90px',
                height: '75px',
                position: 'absolute',
                bottom: '28px',
                left: '80px',
              }}
            >
              <Image
                src={assets.mbti.strengthHeart2}
                fill
                priority
                alt="strength-heart"
                style={{
                  scale: 1.15,
                }}
              ></Image>
            </Box>
            <Box
              sx={{
                width: '120px',
                height: '110px',
                position: 'absolute',
                bottom: '-26px',
                left: '-10px',
              }}
            >
              <Image
                src={assets.mbti.strengthHeart}
                fill
                priority
                alt="strength-heart"
                style={{
                  scale: 1.35,
                }}
              ></Image>
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              // height: 'calc(100vh - 60px - 375px - 20px)',
              height: 'calc(607px - 375px - 20px)',
              padding: '0px 4px 0px 0px',
            }}
          >
            {i == 1 &&
              fullReport &&
              fullReport.Strengths &&
              fullReport.Strengths.slice(0, 2).map(
                (strength: string, index: number) => {
                  const [title, content] = strength.split(':');
                  return (
                    <_PropSection key={index} title={title} content={content} />
                  );
                },
              )}

            {i == 2 &&
              fullReport &&
              fullReport.Strengths &&
              fullReport.Strengths.slice(2, 4).map(
                (strength: string, index: number) => {
                  const [title, content] = strength.split(':');
                  return (
                    <_PropSection key={index} title={title} content={content} />
                  );
                },
              )}
          </Grid>
        </Grid>
      </>
    </CardFrame>
  );
};

export default CardStrength;
