/**
 * This page is publicly sharable
 */

'use client';
import { PublicProfilePage } from '@/app/[locale]/c/(tabs)/profile/v/default/PublicProfilePage';

import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { useCommunityProfilePagePublicByUserHandle } from '@/data/graphql/hooks/useCommunityProfilePagePublicByUserHandle';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import useCommunity from '@/hooks/useCommunity';
import useLogProfileEvent from '@/hooks/useLogProfileEvent';
import colors from '@/styles/colors.config';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography } from '@mui/material';
import { NextPage } from 'next';
import React, { useState } from 'react';

type Props = {
  params: {
    locale: string;
    userHandle: string;
  };
};

const Page: NextPage<Props> = ({ params: { locale, userHandle } }) => {
  const { community } = useCommunity();
  const {
    state: { communityProfilePagePublicInit, communityProfilePagePublic },
  } = useCommunityProfilePagePublicByUserHandle({
    communityId: community.community_id,
    userHandle: userHandle,
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
        bottomCTA={
          <>
            <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
            <Button
              onClick={() => {
                // @dev use window to hard reload
                logProfileReferralClick(
                  communityProfilePagePublic?.persona?.ownReferralCode || '',
                );
                window.location.href = `/?referralcode=${communityProfilePagePublic?.persona?.ownReferralCode}`;
              }}
              variant="outlined"
              sx={{
                color: colors.white,
                width: '295px',
                height: '40px',
                borderColor: colors.white,
                '&:hover': {
                  color: colors.white,
                  borderColor: colors.white,
                },
              }}
            >
              <Typography variant="labelLarge">Create Yours</Typography>
            </Button>
          </>
        }
      />

      {/* <LoadingButton
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
      </LoadingButton> */}
    </Box>
  );
};

export default Page;
