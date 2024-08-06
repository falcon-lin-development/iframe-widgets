'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';

// components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { Box, Stack } from '@mui/material';
import TabSection, { TabPanel } from '@/components/TabSection';
import { InboxCard } from './InboxCards.client';
import { NotificationCard } from './NotificationCard.client';
import { InboxSection } from './InboxSection';
import { NotificationSection } from './NotificationSection';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityInboxs from '@/hooks/useCommunityInboxs';
import { useScroll } from 'framer-motion';

// constants
import colors from '@/styles/colors.config';
import { useCommunityNotifications } from '../../providers/CommunityNotificationContextProvider';
import { useNotifications } from '../../graphql/hooks/useGetNotifications';

const _useScrolling = () => {
  const { scrollY } = useScroll();
  const [_boxShadow, setBoxShadow] = useState('unset');

  // subscription to scrollY
  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.get() === 0) {
        setBoxShadow('unset');
      } else {
        setBoxShadow('0px 2px 4px rgba(0, 0, 0, 0.1)');
      }
    };
    const unsubscribeScollY = scrollY.on('change', handleScroll);
    return () => {
      unsubscribeScollY();
    };
  }, []);

  return {
    boxShadow: _boxShadow,
  };
};

export type InboxPageStateHook = ReturnType<typeof _useInboxPageState>;
const _useInboxPageState = () => {
  const { community } = useCommunity();

  const {
    state: { notificationsState },
    actions: { refreshNotifications, queryNextNotifications },
  } = useNotifications(community);
  const [readedState, setReadedState] = useState<Record<string, boolean>>({});

  const markAsRead = (notificationId: string) => {
    setReadedState((prev) => ({ ...prev, [notificationId]: true }));
  };

  return {
    state: {
      readedState,
      notificationsState,
    },
    actions: {
      markAsRead,
      refreshNotifications,
      queryNextNotifications,
    },
  };
};

const InboxScaffold: React.FC<{
  appbar: React.ReactNode;
}> = ({ appbar }) => {
  //   const { communityProfile } = useCommunityProfile(community);
  const pageState = _useInboxPageState();

  // UI
  const { boxShadow } = _useScrolling();

  return (
    <Scaffold
      appbar={appbar}
      mainBody={
        <MainBody
          style={{
            color: colors.neutralSwatch.main[10],
            alignItems: 'stretch',
            borderRadius: '0.5rem',
          }}
        >
          <Box
            sx={{
              padding: '1rem',
            }}
          >
            <NotificationSection pageState={pageState} />
          </Box>
          {/* <TabSection
            tabs={[
              {
                label: 'Notifications',
                content: (
                  <Box
                    sx={{
                      padding: '1rem',
                    }}
                  >
                    <NotificationSection pageState={pageState} />
                  </Box>
                ),
              },
              {
                label: 'Inbox',
                content: (
                  <Box
                    sx={{
                      padding: '1rem',
                    }}
                  >
                    <InboxSection />
                  </Box>
                ),
              },
            ]}
            sx={{
              position: 'sticky',
              top: '52px', // top height
              backgroundColor: colors.white,
              boxShadow: boxShadow,
              '& .MuiTab-root': {
                width: '50%',
              },
            }}
          /> */}
        </MainBody>
      }
    />
  );
};

export default InboxScaffold;
