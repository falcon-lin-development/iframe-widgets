'use client';

// Skeletons
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import CommunityNavBar from '@/components/navbars/CommunityNavBar.client';
import CommunityAppBar from '@/components/appbars/CommunityAppBar.client';

// components
import WYRHeader from '../WYRHeader.client';

// hooks
import { usePageState } from '../pageStateContextProvider';
import { motion, useScroll, useTransform } from 'framer-motion';

// constant
import colors from '@/styles/colors.config';
import { SxProps, Theme } from '@mui/material';
import { useEffect, useState } from 'react';
import { GAMESTATE } from './gameScene/useGameState';

const TabSkeleton: React.FC<{
  value: number;
  setValue: (tabId: number) => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ value, setValue, children, sx }) => {
  const {
    state: { community, communityProfile, gameState },
  } = usePageState();

  return (
    <Scaffold
      sx={sx}
      appbar={<CommunityAppBar community={community} />}
      mainBody={
        <>
          <MainBody
            style={{
              color: colors.neutralSwatch.main[10],
            }}
            sx={{
              ...sx,
            }}
          >
            <WYRHeader
              sx={{
                // padding: '12px 16px 12px 16px',
                padding: '16px',
                width: '100%',
                position: 'sticky',
                top: 52,
                zIndex: 2, // just above picker shadow
                backgroundColor: colors.white,
                // backdropFilter: 'blur(10px)',
                // borderRadius: '0px 0px 8px 8px',
                // boxShadow: boxShadow,
              }}
              currentIndex={value}
              setCurrentIndex={setValue}
            />
            {children}
          </MainBody>
        </>
      }
      bottomNavbar={<CommunityNavBar communityProfile={communityProfile} />}
    />
  );
};

export default TabSkeleton;

//
export const EnimatedTabSkeleton: React.FC<{
  value: number;
  setValue: (tabId: number) => void;
  children: React.ReactNode;
}> = ({ value, setValue, children }) => {
  const {
    // const: {},
    state: { isInit, community, communityProfile, gameState },
    actions: { setGameState },
  } = usePageState();

  return (
    <Scaffold
      appbar={
        gameState !== GAMESTATE.INIT ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {
                opacity: 0,
                y: -100,
              },
              show: {
                y: 0,
                opacity: 1,
                transition: {
                  transition: { duration: 2 },
                },
              },
            }}
          >
            <CommunityAppBar community={community} />
          </motion.div>
        ) : (
          <CommunityAppBar community={community} />
        )
      }
      mainBody={
        <>
          <MainBody
            style={{
              color: colors.neutralSwatch.main[10],
            }}
          >
            <WYRHeader
              sx={{
                // padding: '16px 16px 16px 16px',
                padding: '16px',

                width: '100%',
                position: 'sticky',
                top: 52,
                zIndex: 2, // just above picker shadow
                backgroundColor: colors.white,
                // backdropFilter: 'blur(10px)',
                // borderRadius: '0px 0px 8px 8px',
                // boxShadow: boxShadow,
              }}
              currentIndex={value}
              setCurrentIndex={setValue}
            />
            {children}
          </MainBody>
        </>
      }
      bottomNavbar={
        gameState !== GAMESTATE.INIT ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              show: {
                y: 0,
                opacity: 1,
                transition: {
                  transition: { duration: 2 },
                },
              },
            }}
          >
            <CommunityNavBar
              showText={true}
              sx={{}}
              communityProfile={communityProfile}
            />
          </motion.div>
        ) : (
          <CommunityNavBar
            showText={true}
            sx={{}}
            communityProfile={communityProfile}
          />
        )
      }
    />
  );
};
