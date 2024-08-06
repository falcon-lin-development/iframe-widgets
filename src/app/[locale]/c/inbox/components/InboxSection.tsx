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

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityInboxs from '@/hooks/useCommunityInboxs';
import { useScroll } from 'framer-motion';

// constants
import colors from '@/styles/colors.config';
import { useCommunityNotifications } from '../../providers/CommunityNotificationContextProvider';

// Inbox Section
const InboxSection: React.FC = () => {
  const { community } = useCommunity();

  const { communityInboxs, refreshInboxs } = useCommunityInboxs(community);
  return (
    <>
      {communityInboxs.count >= 0 ? (
        <>
          <Stack spacing={2}>
            {communityInboxs.results.map((inbox, index) => {
              return <InboxCard key={inbox.msg_id} inbox={inbox} />;
            })}
          </Stack>
        </>
      ) : null}

      {communityInboxs.has_next === false && (
        <div className="body-small tw-text-neutralSwatch-80 tw-py-[1rem] tw-text-center">
          There are no more messages at the moment
        </div>
      )}
    </>
  );
};

export { InboxSection };
