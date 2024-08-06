/**
 * Users Own Profile Page
 */
'use client';
import { NextPage } from 'next';
import { PublicProfilePage } from '@/app/[locale]/c/(tabs)/profile/v/default/PublicProfilePage';

import LoadingPage from '@/components/loadingScreens/LoadingPage';

// hooks
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { SharableButton } from '@/components/buttons/ShareButton.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import colors from '@/styles/colors.config';
import { Box, IconButton, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';

const OwnPublicProfilePage: NextPage = () => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const {
    state: { communityProfilePagePublic, communityProfilePagePublicInit },
  } = useCommunityProfilePagePublic({
    communityId: community.community_id,
    personaId: communityProfile.persona_id,
  });
  const { logButtonClick } = useLogEvent();
  // const router = useRouter();
  const { navigate } = useAppRouting();

  if (!communityProfilePagePublicInit) {
    return <LoadingPage loadingText="Loading Own Profile..." />;
  }
  const publicProfile = communityProfilePagePublic!;

  return (
    <>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <PublicProfilePage
          communityLogo={community.logo_url}
          publicProfile={communityProfilePagePublic!}
        />

        <Box
          sx={{
            position: 'absolute',
            zIndex: 1,
            top: 16,
            left: 16,
          }}
        >
          <IconButton
            sx={{
              background: colors.secondarySwatch.main[90],
              borderRadius: '9999px',
              padding: '6px',
              ':hover': {
                background: colors.secondarySwatch.main[90],
              },
            }}
            href={routes.c.profile._home}
          >
            <X
              // color={colors.white}
              color={colors.secondarySwatch.main[10]}
              size={14}
            />
          </IconButton>
        </Box>
        <SharableButton
          sx={{
            // @dev position
            position: 'absolute',
            right: 6,
            top: 6,
            zIndex: 1,
          }}
          shareProps={{
            url: publicProfile.generatedUrl,
            title: 'Check out my Mootiez profile',
            // text: "Check out my Mootiez profile",
            logButtonClick: logButtonClick,
          }}
        >
          <Box
            sx={{
              background: colors.secondarySwatch.main[90],
              color: colors.secondarySwatch.main[10],
              borderRadius: '9999px',
              padding: '4px 16px',
            }}
          >
            <Typography variant="labelLarge">Share</Typography>
          </Box>
        </SharableButton>
      </Box>
    </>
  );
};

export default OwnPublicProfilePage;
