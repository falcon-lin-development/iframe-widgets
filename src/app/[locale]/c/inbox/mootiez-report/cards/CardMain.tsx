import mootiezTheme, { themeColors } from '@/styles/mui/mootiezTheme';
import { MBTIData, getType } from '@/redux/features/mbti/mbtiSlice';
import React from 'react';
import { Card, Box, Tab, Tabs, Grid, Typography } from '@mui/material';
import CardFrame from './CardFrame';

export const calculateMBTIScale = (
  l?: string | number,
  r?: string | number,
  max_score?: number,
) => {
  if (!max_score) {
    max_score = 10;
  }
  const total = -Number(l) + Number(r) + max_score;
  return (total / (max_score * 2)) * 100;
};

const CardMain: React.FC<{
  id: string;
  mbti: MBTIData;
  profileUrl: string;
  report: Record<string, any>;
  fadeIn?: boolean;
}> = ({ mbti, profileUrl, report, id, fadeIn }) => {
  const _Line: React.FC<{
    t: string;
    l: string;
    r: string;
    percentage: number;
  }> = ({ t, l, r, percentage }) => {
    return (
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          color: 'white',
          padding: '0px 16px',
          fontSize: '12px',
          gap: '12px',
        }}
      >
        <Grid
          item
          xs={2}
          style={{
            color: '#004D62',
          }}
        >
          <Typography variant="bodyReport">{t}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="bodyReport">{l}</Typography>
        </Grid>
        <Grid
          item
          title={`${percentage}%`}
          sx={{
            position: 'relative',
            marginX: '10px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              minWidth: '101px',
              maxWidth: '115px',
              height: '2px',
              bgcolor: 'white',
              borderRadius: '40px',
            }}
          ></Box>
          <Box
            sx={{
              width: '6px',
              height: '6px',
              bgcolor: 'white',
              borderRadius: '9999px',
              position: 'absolute',
              top: '-2px',
              left: `${percentage}%`,
              // left: "100%"
            }}
          ></Box>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="bodyReport">{r}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <CardFrame
      id={id}
      bgColorStart={themeColors.purple}
      bgColorEnd={themeColors.blue}
      mbtiType={getType(mbti)}
      profileUrl={profileUrl}
      sx={{}}
      fadeIn={fadeIn}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            color: 'white',
            padding: '16px 16px 0px 16px',
          }}
        >
          <Typography variant="headlineReport">
            {report && report.mbtiPersonality}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            color: 'white',
            padding: '4px 16px 0px 16px',
            fontSize: '12px',
            width: '80%',
          }}
        >
          <Typography
            variant="bodyReport"
            sx={{
              textAlign: 'left',
            }}
          >
            {report && report.mbtiDesc}
          </Typography>
        </Box>
        {/* <Box sx={{ paddingTop: '1.5rem' }} aria-label="hidden"></Box> */}
        <Box
          sx={{
            color: 'white',
            position: 'absolute',
            bottom: '8px',
            width: '100%',
          }}
        >
          <_Line
            t="ENERGY"
            l="Extraverted"
            r="Introverted"
            percentage={calculateMBTIScale(mbti.e, mbti.i)}
          />
          <_Line
            t="MIND"
            l="Intuitive"
            r="Sensing"
            percentage={calculateMBTIScale(mbti.n, mbti.s)}
          />
          <_Line
            t="NATURE"
            l="Thinking"
            r="Feeling"
            percentage={calculateMBTIScale(mbti.t, mbti.f)}
          />
          <_Line
            t="TACTICS"
            l="Judging"
            r="Perceiving"
            percentage={calculateMBTIScale(mbti.j, mbti.p)}
          />
        </Box>
      </>
    </CardFrame>
  );
};

export default CardMain;
