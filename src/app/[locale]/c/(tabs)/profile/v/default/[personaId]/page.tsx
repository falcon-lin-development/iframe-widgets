/**
 * This page is publicly sharable
 */

'use client';
import { PublicProfilePage } from '@/app/[locale]/c/(tabs)/profile/v/default/PublicProfilePage';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import useCommunity from '@/hooks/useCommunity';
import useLogProfileEvent from '@/hooks/useLogProfileEvent';
import colors from '@/styles/colors.config';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { NextPage } from 'next';
import React, { useState } from 'react';

type Props = {
  params: {
    locale: string;
    personaId: string;
  };
};

const Page: NextPage<Props> = ({ params: { locale, personaId } }) => {
  const { community } = useCommunity();
  const {
    state: { communityProfilePagePublicInit, communityProfilePagePublic },
  } = useCommunityProfilePagePublic({
    communityId: community.community_id,
    personaId: personaId,
  });
  const { logProfileReferralClick } = useLogProfileEvent({
    publicProfile:
      communityProfilePagePublic || ({} as CommunityProfilePagePublic),
  });
  if (!communityProfilePagePublicInit) {
    return <LoadingPage />;
  }

  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <PublicProfilePage
        communityLogo={community.logo_url}
        publicProfile={communityProfilePagePublic!}
      />
      <LoadingButton
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          zIndex: 1,

          background: colors.secondarySwatch.main[90],
          color: colors.secondarySwatch.main[10],
          borderRadius: '9999px',
          padding: '4px 16px',

          '&:hover': {
            background: colors.secondarySwatch.main[90],
            color: colors.secondarySwatch.main[10],
          },
        }}
        // loading={state.state.isSaving}
        // disabled={state.state.isSaving}
        onClick={() => {
          logProfileReferralClick(
            communityProfilePagePublic?.persona?.ownReferralCode || '',
          );
          window.location.href = `/?referralcode=${communityProfilePagePublic?.persona?.ownReferralCode}`;
        }}
      >
        <Typography variant="labelLarge">Create Yours</Typography>
      </LoadingButton>
    </Box>
  );
};

export default Page;
