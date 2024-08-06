'use client';

//client
import { CombinedError, useMutation, useQuery } from 'urql';

// models
import {
  GET_POINT_TRACKING_FOR_WYR,
  PointTrackingForWyr,
} from '../models/PointTrackingForWyr';
import { Community } from '@/data/services/fetchCommunityService';

export const useGetPointTrackingForWyr = (community: Community) => {
  const [result, reexecuteQuery] = useQuery<{
    getPointTrackingForWyr: PointTrackingForWyr;
  }>({
    query: GET_POINT_TRACKING_FOR_WYR,
    variables: { communityId: community.community_id },
    requestPolicy: 'network-only',
  });

  return {
    state: {
      pointTrackingForWyrState: result,
    },
    actions: {
      refreshPointTrackingForWyr: () =>
        reexecuteQuery({
          requestPolicy: 'network-only',
        }),
    },
  };
};
