'use client';
import AppIcon from '@/components/AppIcon';
import assets from '@/constants';
import { Box, Typography } from '@mui/material';
import React from 'react';

// hooks
import { useCommunityId } from '@/hooks/useCommunity';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import Image from 'next/image';
import { BioWidgetType, UserNameWidgetType } from './ProfileWidgetTypes';
import colors from '@/styles/colors.config';
// avatar widget

type BioWidgetProp = {
  bio: string;
  widgetData: BioWidgetType;
};

export const BioWidget: React.FC<BioWidgetProp> = ({ bio, widgetData }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography
        variant="bodyMedium"
        sx={{
          fontWeight: 'normal',
          fontFamily: 'Basier Circle',
          color: colors.white,
          transform: 'translateY(2px)',
        }}
      >
        {bio}
      </Typography>
    </Box>
  );
};
