import assets, { ButtonID } from '@/constants';
import Image from 'next/image';

import mootiezTheme, { themeColors } from '@/styles/mui/mootiezTheme';
import colors from '@/styles/colors.config';
import { MBTIData, getType } from '@/redux/features/mbti/mbtiSlice';
import React from 'react';
import { Card, Box, Tab, Tabs, Grid, Typography } from '@mui/material';

import CardFrame from './CardFrame';

const CardWeakness: React.FC<{
  id: string;
  mbti: MBTIData;
  profileUrl: string;
  report: Record<string, any>;
  fullReport: Record<string, any>;
  i: number;
}> = ({ mbti, profileUrl, report, i, fullReport, id }) => {
  const _PropSection: React.FC<{
    title: string;
    content: string;
  }> = ({ title, content }) => {
    return (
      <Box>
        <Typography variant="labelReport">{title}</Typography>
        <br />
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
      bgColorStart={i == 1 ? themeColors.blue : themeColors.purple}
      bgColorEnd={i == 1 ? themeColors.pink : themeColors.yellow}
      hasGrayOverlay={false}
      mbtiType={getType(mbti)}
      profileUrl={profileUrl}
    >
      <>
        <Grid
          container
          sx={{
            color: i == 1 ? 'white' : colors.neutralSwatch.main[10],
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
            <Typography variant="subtitleReport">WEAKNESSES</Typography>
            <Box
              sx={{
                width: '90px',
                height: '75px',
                position: 'absolute',
                bottom: '78px',
                left: '95px',
              }}
            >
              <Image
                src={assets.mbti.weakness2}
                fill
                priority
                alt="weakness"
                style={{
                  scale: 1.4,
                }}
              ></Image>
            </Box>
            <Box
              sx={{
                width: '120px',
                height: '110px',
                position: 'absolute',
                bottom: '10px',
                left: '-15px',
              }}
            >
              <Image
                src={assets.mbti.weakness}
                fill
                priority
                alt="weakness"
                style={{
                  scale: 1.25,
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
              fullReport.Weaknesses &&
              fullReport.Weaknesses.slice(0, 2).map(
                (strength: string, index: number) => {
                  const [title, content] = strength.split(':');
                  return (
                    <_PropSection key={index} title={title} content={content} />
                  );
                },
              )}

            {i == 2 &&
              fullReport &&
              fullReport.Weaknesses &&
              fullReport.Weaknesses.slice(2, 4).map(
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

export default CardWeakness;
