'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography, Grid, Button } from '@mui/material';

// Internal Project Components
import SocialShareSection from '@/app/[locale]/mbti/mootiez-report/SocialShareSection';

// Hooks

// Utilities and Redux Features
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets, { ButtonID } from '@/constants';
import { getImageIndexFromDI } from './utils';

const WrapSection: React.FC<{
  profile: CommunityProfile;
  dI: number;
}> = ({ profile, dI }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // gap: '8px',
        padding: '1rem 12px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="headlineSmall" sx={{}}>
        ask for more feedback!
      </Typography>
      <Box sx={{ paddingTop: '0.5rem' }} aria-label="spacer" />

      <Typography variant="bodyLarge" sx={{}}>
        sometimes, it helps to get a few more people's feedback on what they
        think your MBTI might be.
      </Typography>

      {/* <InviteDelusionIndexSurveySection referral_code={profile.own_referral_code}/> */}
      <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
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
          share with your friends:
        </Typography>

        <SocialShareSection
          title={
            'Hey! \n\nCan you help me take this MBTI test as if you were me? It will help me check how delusional I am 😂'
          }
          url={`${process.env.SHARE_MY_TEST_TO_FRD_URL || 'https://mootiez.com/'}?referralcode=${profile.own_referral_code}`}
          iconSize={32}
          shareAction={ButtonID.social_share.share_di}
          copyAction={ButtonID.social_share.copy_to_clipboard_di}
        />

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
      </Box>
    </Box>
  );
};

export default WrapSection;
