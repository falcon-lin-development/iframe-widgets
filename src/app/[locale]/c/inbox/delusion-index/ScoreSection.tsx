'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography } from '@mui/material';

// Utilities and Redux Features
import {
  getColorCodeFromDI,
  getCopyWritingIndexFromDI,
  getImageIndexFromDI,
} from './utils';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets from '@/constants';

const ScoreSection: React.FC<{
  dI: number;
  copywritings: Record<string, any> | null;
}> = ({ dI, copywritings }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // gap: '8px',
        padding: '12px',
        borderRadius: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Typography
          variant="headlineSmall"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          you are
        </Typography>
        <Typography variant="headlineLarge" color={getColorCodeFromDI(dI)}>
          {dI.toFixed()}%
        </Typography>
        <Typography
          variant="headlineSmall"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          delusional
        </Typography>
      </Box>

      <Box sx={{ paddingTop: '0.5rem' }} aria-label="spacer" />

      <Typography variant="bodyLarge">
        {copywritings &&
          copywritings[getCopyWritingIndexFromDI(dI)]['Headline_full']}
      </Typography>
      <Box sx={{ paddingTop: '1rem' }} aria-label="spacer" />

      <Box
        sx={{
          width: '100%',
          position: 'relative', // Required for Next.js Image component with fill layout
          aspectRatio: 1,
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={
            assets.mbti.dI[
              getImageIndexFromDI(dI) as keyof typeof assets.mbti.dI
            ]
          }
          alt={`Delusion Index Image ${getImageIndexFromDI(dI)}`}
          fill
          priority
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>
      <Box sx={{ paddingTop: '1rem' }} aria-label="spacer" />
    </Box>
  );
};

export default ScoreSection;
