'use client';
import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';

// componentss
import CommunityNavBar from '@/components/navbars/CommunityNavBar.client';
import CommunityAppBar from '@/components/appbars/CommunityAppBar.client';
import { Box, Divider, ThemeProvider, Typography } from '@mui/material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// models
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityInboxMessagesList } from '@/data/repositaries/CommunityInboxRepo';
import colors from '@/styles/colors.config';

const MotionTypography = motion(Typography); // Create a motion component from Typography
const MotionBox = motion(Box); // Create a motion component from Box

export const FadingAppbar: React.FC<{
  community: Community;
}> = ({ community }) => {
  return (
    <>
      {/* {isVisible &&  */}
      <motion.div
        initial="present"
        animate="vanish"
        variants={{
          present: { y: 0, opacity: 1 },
          vanish: {
            y: -100,
            opacity: 0,
            transition: { duration: 2 },
          },
        }}
        // onAnimationComplete={() => { setIsVisible(true) }}
        style={{
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 10,
          backgroundColor: colors.primarySwatch.main[98],
        }}
      >
        <CommunityAppBar community={community} />
      </motion.div>
      {/* } */}
    </>
  );
};

export const FadingNavbar: React.FC<{
  communityProfile: CommunityProfile;
}> = ({ communityProfile }) => {
  return (
    <>
      {/* {isVisible ?  */}
      <motion.div
        initial="prensent"
        animate="vanish"
        variants={{
          prensent: { y: 0, opacity: 1 },
          vanish: {
            y: 100,
            opacity: 0,
            transition: { duration: 2 },
          },
        }}
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          zIndex: 10,
          borderRadius: '8px 8px 0px 0px',
          backgroundColor: colors.primarySwatch.main[98],
        }}
        // onAnimationComplete={() => { setIsVisible(true) }}
        className={`tw-max-w-mobile`}
      >
        <CommunityNavBar showText={true} communityProfile={communityProfile} />
      </motion.div>
      {/* : null} */}
    </>
  );
};
