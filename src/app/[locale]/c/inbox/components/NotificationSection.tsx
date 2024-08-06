'use client';
import React, { useEffect, useState } from 'react';

// components
import { Box, Divider, Stack, Typography } from '@mui/material';
import { NotificationCard } from './NotificationCard.client';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityInboxs from '@/hooks/useCommunityInboxs';
import { useScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// constants
import colors from '@/styles/colors.config';
import {
  useCommunityNotifications,
  NotificationsContextHook,
} from '../../providers/CommunityNotificationContextProvider';
import { LoadingButton } from '@mui/lab';
import { InboxPageStateHook } from './InboxScaffold.client';

const _useInfinityScrollHook = ({
  pageState,
}: {
  pageState: InboxPageStateHook;
}) => {
  const {
    state: { notificationsState },
    actions: { queryNextNotifications },
  } = pageState;
  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Triggers when 10% of the element is visible
  });

  useEffect(() => {
    if (
      inView &&
      Boolean(
        notificationsState.data?.listNotifications.nextData.lastNotificationId,
      )
    ) {
      queryNextNotifications();
    }
  }, [
    inView,
    notificationsState.data?.listNotifications.nextData.lastNotificationId,
  ]);

  return {
    ref,
  };
};

// Notification Section
const NotificationSection: React.FC<{
  pageState: InboxPageStateHook;
}> = ({ pageState }) => {
  const { community } = useCommunity();
  const {
    state: { notificationsState },
    actions: { refreshNotifications, queryNextNotifications },
  } = pageState;
  const notifications = notificationsState.data.listNotifications.notifications;
  const { ref } = _useInfinityScrollHook({ pageState: pageState });

  return (
    <>
      {notifications.length > 0 && (
        <>
          <Stack spacing={2}>
            {notifications.map((notification, index) => {
              return (
                <NotificationCard
                  key={notification.notificationId}
                  notification={notification}
                  community={community}
                  pageState={pageState}
                />
              );
            })}
          </Stack>
        </>
      )}
      <Divider sx={{ width: '100%', margin: '16px 0px' }} ref={ref}>
        <LoadingButton
          variant="text"
          loading={notificationsState.fetching}
          onClick={() => queryNextNotifications()}
          disabled={
            !notificationsState.data?.listNotifications.nextData
              .lastNotificationId
          }
        >
          <Typography variant="bodySmall">
            {notificationsState.data?.listNotifications.nextData
              .lastNotificationId
              ? `Load more`
              : 'End of the list'}
          </Typography>
        </LoadingButton>
      </Divider>
    </>
  );
};

export { NotificationSection };
