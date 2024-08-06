'use client';

// client
import { useMutation, useQuery } from 'urql';

// models / query
import { Community } from '@/data/services/fetchCommunityService';
import {
  READ_NOTIFICATION,
  ReadNotification,
} from '../models/readNotification';
import { BackendNotification } from '../models/BackendNotification';

export const useReadNotification = ({
  notification,
  community,
}: {
  notification?: BackendNotification;
  community: Community;
}) => {
  const [readResult, _readNotification] = useMutation<{
    readNotification: ReadNotification;
  }>(READ_NOTIFICATION);

  const readNotification = async () => {
    try {
      const promise = _readNotification({
        communityId: community.community_id,
        notificationId: notification?.notificationId || '',
      });

      promise
        .then((result) => {
          if (result.data?.readNotification.status) {
            console.log('Notification marked as read');
          } else {
            console.log('error: ', result.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return promise;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    state: {
      readResult,
    },
    actions: {
      readNotification,
    },
  };
};
