'use client';
import AppIcon from '@/components/AppIcon';
import assets from '@/constants';
import { Box } from '@mui/material';
import React from 'react';

export const MootiezBrandingWidget: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <AppIcon iconImageUrl={assets.images.app.logo} />
    </Box>
  );
};
