'use client';

// query
import { useMutation, useQuery } from 'urql';

// models / query
import {
  CommunityProfilePagePublic,
  GET_COMMUNITY_PROFILE_PAGE_PUBLIC_BY_USER_HANDLE,
} from '../models/CommunityProfilePagePublic';
import { useEffect, useMemo } from 'react';

export const useCommunityProfilePagePublicByUserHandle = ({
  communityId,
  userHandle,
}: {
  communityId: string;
  userHandle: string;
}) => {
  const [result, refreshCommunityProfilePagePublic] = useQuery<{
    getCommunityProfilePagePublicByHandle: CommunityProfilePagePublic;
  }>({
    query: GET_COMMUNITY_PROFILE_PAGE_PUBLIC_BY_USER_HANDLE,
    variables: {
      userHandle: userHandle,
    },
    requestPolicy: 'network-only',
  });

  // init
  const init = useMemo(() => {
    console.log(result);
    return Boolean(
      result.data?.getCommunityProfilePagePublicByHandle?.communityId,
    );
  }, [result]);

  return {
    state: {
      communityProfilePagePublicInit: init,
      communityProfilePagePublic:
        result.data?.getCommunityProfilePagePublicByHandle,
      communityProfilePageState: result,
    },
    actions: {
      refreshCommunityProfilePagePublic: async () => {
        return refreshCommunityProfilePagePublic({
          requestPolicy: 'network-only',
        });
      },
    },
  };
};
