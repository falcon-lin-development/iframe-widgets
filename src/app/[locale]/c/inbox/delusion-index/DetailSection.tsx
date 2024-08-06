'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography, Grid, Button } from '@mui/material';

// Utilities and Redux Features
import { MBTIFromFriend, getType } from '@/redux/features/mbti/mbtiSlice';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { getCopyWritingIndexFromDI } from './utils';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets from '@/constants';
import Link from 'next/link';

const DetailSection: React.FC<{
  dI: number;
  profile: CommunityProfile;
  mbtiFromFriend: MBTIFromFriend;
  copywritings: Record<string, any> | null;
}> = ({ dI, profile, mbtiFromFriend, copywritings }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '1rem 12px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="headlineSmall">Am I really delusional?</Typography>
        {copywritings &&
          (
            copywritings[getCopyWritingIndexFromDI(dI)][
              'Copywriting'
            ] as string[]
          ).map((copywriting: string, index: number) => {
            return (
              <Typography
                key={index}
                variant="bodyMedium"
                sx={{
                  color: colors.neutralSwatch.main[30],
                  fontFamily: 'Libre Franklin',
                  textAlign: 'justify',
                }}
              >
                {copywriting}
              </Typography>
            );
          })}
        <Box sx={{ paddingY: '0.5rem' }} aria-label="spacer" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'blur(8px)',
          // position: 'absolute',
          // left: 0,
          overflow: 'hidden',
        }}
      >
        <Image
          alt="Personality Avatar"
          src={profile.profile_avatar_url || assets.images.app.defaultAvatar}
          width={148}
          height={148}
          style={{ width: 148, height: 148, borderRadius: `8px` }}
        />
        <Image
          alt="Personality Avatar"
          src={
            assets.mbti.avatar[
              getType(mbtiFromFriend) as keyof typeof assets.mbti.avatar
            ] || assets.images.app.defaultAvatar
          }
          width={148}
          height={148}
          style={{ width: 148, height: 148, borderRadius: `8px` }}
        />
        <Image
          alt="Personality Avatar"
          src={profile.profile_avatar_url || assets.images.app.defaultAvatar}
          width={148}
          height={148}
          style={{ width: 148, height: 148, borderRadius: `8px` }}
        />
      </Box>
      <Box sx={{ paddingY: '0.5rem' }} aria-label="spacer" />
    </>
  );
};

export default DetailSection;
