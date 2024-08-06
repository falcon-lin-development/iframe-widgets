'use client';

// query
import { useMutation, useQuery } from 'urql';

// models / query
import {
  CommunityProfilePagePublic,
  GET_COMMUNITY_PROFILE_PAGE_PUBLIC,
} from '../models/CommunityProfilePagePublic';
import { useEffect, useMemo } from 'react';

export const useCommunityProfilePagePublic = ({
  communityId,
  personaId,
}: {
  communityId: string;
  personaId: string;
}) => {
  const [result, refreshCommunityProfilePagePublic] = useQuery<{
    getCommunityProfilePagePublic: CommunityProfilePagePublic;
  }>({
    query: GET_COMMUNITY_PROFILE_PAGE_PUBLIC,
    variables: {
      communityId: communityId,
      personaId: personaId,
    },
    requestPolicy: 'network-only',
  });

  // init
  const init = useMemo(() => {
    return Boolean(result.data?.getCommunityProfilePagePublic.communityId);
  }, [result]);

  return {
    state: {
      communityProfilePagePublicInit: init,
      communityProfilePagePublic: result.data?.getCommunityProfilePagePublic,
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
