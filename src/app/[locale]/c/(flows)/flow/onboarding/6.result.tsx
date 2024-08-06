'use client';
import React, { useEffect, useState } from 'react';
import { PublicProfilePageWithTutorial } from '@/app/[locale]/c/(tabs)/profile/v/default/PublicProfilePageWithTutorial';

import { motion } from 'framer-motion';
import { _useOnboardingPageState } from './OnboardingFlowPage';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import { Box, Button, Typography } from '@mui/material';
import routes from '@/routes/routes';
import colors from '@/styles/colors.config';
import { SharableButton } from '@/components/buttons/ShareButton.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

const Step6Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const {
    state: { communityProfilePagePublicInit, communityProfilePagePublic },
  } = useCommunityProfilePagePublic({
    communityId: state.state.community.community_id,
    personaId:
      state.state.personaId! || '2d0ed202-95ef-415d-b248-8bf530ad4e0c' || '',
  });
  const { logButtonClick } = useLogEvent();

  if (!communityProfilePagePublicInit) {
    return <LoadingPage loadingText="loading public profile" />;
  }

  const content = (
    <>
      <motion.div
        // add animation to displaying profile page
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
        }}
      >
        <PublicProfilePageWithTutorial
          communityLogo={state.state.community.logo_url}
          publicProfile={communityProfilePagePublic!}
          bottomCTA={
            <>
              <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
              <Button
                onClick={() => {
                  // @dev use window to hard reload
                  window.location.href = routes.c.profile._home;

                  // navigate(routes.c.profile._home);
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
                <Typography variant="labelLarge">Enter Mootiez</Typography>
              </Button>
            </>
          }
        />

        <SharableButton
          sx={{
            // @dev position
            position: 'absolute',
            right: '0px',
            top: '0px',
            zIndex: 1,
          }}
          shareProps={{
            url: communityProfilePagePublic!.generatedUrl,
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
      </motion.div>
    </>
  );

  return <RevealAnimation>{content}</RevealAnimation>;
};

export default Step6Page;

/**
 * Other animations
 */

const RevealAnimation: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    // <div style={{ position: 'relative', overflow: 'auto', height: '100vh' }}>
    // <div className="content">{children}</div>
    <>
      {children}
      <motion.div
        id={'reveal-animation'}
        initial={{ y: 0 }}
        animate={{ y: '102%' }}
        onAnimationComplete={() => {
          /**
           * @dev after animation, remove this widget
           */
          const e = document.getElementById('reveal-animation');
          if (e) document.body.removeChild(e);
        }}
        // animate={{ y: '50%' }}
        transition={{ duration: 8, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boxShadow: '0px 0px 15px 10px rgba(255,255,255,1)',
          // background: 'linear-gradient(135deg, #D095EC 0%, #87E4F9 100%)',
          background: 'linear-gradient(135deg, #EA59A5 0%, #9DADFF 100%)',
          // background: 'linear-gradient(135deg, #D095EC 0%, #87E4F9 100%)',
          // background: 'linear-gradient(135deg, #EA59A5 0%, #9DADFF 100%)',
        }}
      />
    </>
    // </div>
  );
};
