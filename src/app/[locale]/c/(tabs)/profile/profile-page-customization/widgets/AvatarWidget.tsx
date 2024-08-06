'use client';
import AppIcon from '@/components/AppIcon';
import assets from '@/constants';
import { Box } from '@mui/material';
import React from 'react';

// hooks
import { useCommunityId } from '@/hooks/useCommunity';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import Image from 'next/image';
// avatar widget

type AvatarWidgetProp = {
  userAvatarUrl: string;
};

export const AvatarWidget: React.FC<AvatarWidgetProp> = ({ userAvatarUrl }) => {
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
      <Image
        src={userAvatarUrl}
        alt="profile-avatar"
        width={475}
        height={475}
        priority
      ></Image>
    </Box>
  );
};
