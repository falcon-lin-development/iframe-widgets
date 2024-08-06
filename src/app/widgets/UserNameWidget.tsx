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
import { UserNameWidgetType } from './ProfileWidgetTypes';
import colors from '@/styles/colors.config';
// avatar widget

type UserNameWidgetProp = {
  displayName: string;
  userHandle: string;
  widgetData: UserNameWidgetType;
};

export const UserNameWidget: React.FC<UserNameWidgetProp> = ({
  displayName,
  userHandle,
  widgetData,
}) => {
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
        variant="headlineSmall"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Neue Metana',
          color: 'white',
          transform: 'translateY(2px)',
        }}
      >
        {displayName}
      </Typography>
      <Typography
        variant="labelLarge"
        sx={{
          fontWeight: 'normal',
          fontFamily: 'Neue Metana',
          color: colors.neutralSwatch.main[90],
          transform: 'translateY(2px)',
        }}
      >
        @{userHandle}
      </Typography>
    </Box>
  );
};
