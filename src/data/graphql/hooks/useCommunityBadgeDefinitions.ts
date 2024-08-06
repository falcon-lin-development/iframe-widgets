'use client';

// query
import { useMutation, useQuery } from 'urql';

// models
import {
  ListCommunityBadgeDefinitionsResponse,
  CommunityBadgeCategoryType,
  LIST_COMMUNITY_BADGE_DEFINITIONS,
  CommunityBadgeCategory,
} from '../models/CommunityBadgeDefinition';
import useCommunity, { useCommunityId } from '@/hooks/useCommunity';
import { useMemo } from 'react';

export const useCommunityProfileBadgeDefinitions = (
  categoryType: CommunityBadgeCategoryType,
) => {
  const { communityId } = useCommunityId;
  const [result, refreshCommunityBadgeDefinitions] =
    useQuery<ListCommunityBadgeDefinitionsResponse>({
      query: LIST_COMMUNITY_BADGE_DEFINITIONS,
      variables: {
        category: CommunityBadgeCategory,
        categoryType: categoryType,
        communityId: communityId,
      },
      requestPolicy: 'network-only',
    });

  // init
  const init = useMemo(() => {
    return Boolean(result.data?.listCommunityBadgeDefinitions?.badges.length);
  }, [result]);

  return {
    state: {
      communityBadgeDefinitionsInit: init,
      communityBadgeDefinitions:
        result.data?.listCommunityBadgeDefinitions.badges,
      communityBadgeDefinitionsState: result,
    },
    utils: {
      getBadgeId: (pointId: string) => {
        /**
         * the last substring in the substring seperated by "#"
         */
        return pointId.split('#').pop();
      },
    },
    actions: {
      refreshCommunityBadgeDefinitions: async () => {
        return refreshCommunityBadgeDefinitions({
          requestPolicy: 'network-only',
        });
      },
    },
  };
};
