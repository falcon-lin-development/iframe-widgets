'use client';
import React, { useContext, createContext, use, useEffect } from 'react';

import { useNotificationSubscription } from '../graphql/hooks/useNotificationSubscription';
import useCommunity, { useCommunityId } from '@/hooks/useCommunity';

export type NotificationsContextHook = ReturnType<
  typeof _useCommunityNotifications
>;
const _useCommunityNotifications = () => {
  const { communityId } = useCommunityId;

  const {
    state: { personaProfileSubscriptionState },
  } = useNotificationSubscription({ communityId });

  // useEffect(() => {
  //   console.log(
  //     'personaProfileSubscriptionState',
  //     personaProfileSubscriptionState,
  //   );
  // }, [personaProfileSubscriptionState]);

  return {
    state: {
      personaProfileSubscriptionState,
    },
    actions: {},
  };
};

const CommunityNoficationsContext =
  createContext<NotificationsContextHook | null>(null);
export const useCommunityNotifications = () => {
  const context = useContext(CommunityNoficationsContext);
  if (!context) {
    throw new Error(
      'useCommunityNotifications must be used within a CommunityNoficationsContext',
    );
  }
  return context;
};

export const CommunityNotificationContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const _ = _useCommunityNotifications();
  return (
    <CommunityNoficationsContext.Provider value={_}>
      {children}
    </CommunityNoficationsContext.Provider>
  );
};
