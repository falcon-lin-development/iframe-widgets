'use client';
import { useMemo, useEffect, useState } from 'react';

// client
import { useQuery } from 'urql';

// models / query
import { Community } from '@/data/services/fetchCommunityService';

import {
  GET_NOTIFICATIONS_QUERY,
  NotificationList,
} from '../models/NotificationList';
import { BackendNotification } from '../models/BackendNotification';

export const useNotifications = (community: Community) => {
  const [nextData, setNextData] = useState<{
    lastNotificationId: string;
    lastUpdatedAt: number;
  }>({
    lastNotificationId: '',
    lastUpdatedAt: 0,
  });
  const [notificationBuffer, setNotificationBuffer] = useState<
    BackendNotification[]
  >([]);
  const [result, reexecuteQuery] = useQuery<{
    listNotifications: NotificationList;
  }>({
    query: GET_NOTIFICATIONS_QUERY,
    variables: {
      communityId: community.community_id,
      lastNotificationId: nextData.lastNotificationId,
      lastUpdatedAt: nextData.lastUpdatedAt,
      pageSize: 5,
    },

    requestPolicy: 'network-only',
  });

  const safeNextData = useMemo(() => {
    if (
      result.data &&
      !result.error &&
      !result.data.listNotifications.error &&
      result.data?.listNotifications.notifications.length > 0
    ) {
      if (result.data.listNotifications.notifications.length > 0) {
        // if 0 then no more data.
        return {
          lastNotificationId:
            result.data.listNotifications.notifications[
              result.data.listNotifications.notifications.length - 1
            ].notificationId,
          lastUpdatedAt:
            result.data.listNotifications.notifications[
              result.data.listNotifications.notifications.length - 1
            ].updatedAt,
        };
      }
    }
    return {
      lastNotificationId: '',
      lastUpdatedAt: 0,
    };
  }, [result.data]);

  // merge list
  useEffect(() => {
    const _mergeList = (
      oldList: BackendNotification[],
      newList: BackendNotification[],
    ) => {
      let newBuffer;
      if (oldList.length === 0) {
        newBuffer = newList;
      } else {
        const lastTimeStamp = oldList[oldList.length - 1].updatedAt;
        newBuffer = [
          ...oldList,
          ...newList.filter(
            (v: BackendNotification) => v.updatedAt < lastTimeStamp,
          ),
        ];
      }
      return newBuffer;
    };

    //  if data, merge list
    console.log('notification result', result);
    if (result.data) {
      const newBuffer = _mergeList(
        notificationBuffer,
        result.data.listNotifications.notifications,
      );
      setNotificationBuffer(newBuffer);
    }
  }, [result.data]);

  return {
    state: {
      notificationsState: {
        data: {
          listNotifications: {
            notifications: notificationBuffer,
            notificationFlag: result.data?.listNotifications.notificationFlag,
            nextData: {
              ...safeNextData,
            },
          },
        },
        fetching: result.fetching,
        error: result.error,
        stale: result.stale,
        extensions: result.extensions,
      },
    },
    actions: {
      refreshNotifications: () => {
        setNotificationBuffer([]);
        reexecuteQuery({
          requestPolicy: 'network-only',
        });
      },
      queryNextNotifications: () => {
        setNextData({
          ...safeNextData,
        });
      },
    },
  };
};
