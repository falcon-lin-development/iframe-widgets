'use client';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  BadgeHolding,
  GetPersonaCommunityBadgeBalancesResponse,
  GET_USER_ATTRIBUTES_QUERY,
} from '../models/PersonaAttributeBadges';
import { useMemo } from 'react';
import { CommunityBadgeCategoryType } from '../models/CommunityBadgeDefinition';

export const usePersonaAttributeBadges = () => {
  const [result, getUserAttributes] =
    useQuery<GetPersonaCommunityBadgeBalancesResponse>({
      query: GET_USER_ATTRIBUTES_QUERY,
    });

  const userAttributes = useMemo(() => {
    return result.data?.getPersonaCommunityBadgeBalances.holding || [];
  }, [result]);

  return {
    state: {
      userAttributesInit: Boolean(
        result.data?.getPersonaCommunityBadgeBalances,
      ),
      userAttributes: userAttributes,
      userAttributesState: result,
      alreadyHasMBTI: Boolean(
        userAttributes.find((attr) => attr.pointId.includes('mbti')),
      ),
      alreadyHasPronouns: Boolean(
        userAttributes.find((attr) => attr.pointId.includes('pronoun')),
      ),
      alreadyHasChineseZodiac: Boolean(
        userAttributes.find((attr) =>
          attr.pointId.includes(CommunityBadgeCategoryType.chinesezodiac),
        ),
      ),
      alreadyHasWesternZodiac: Boolean(
        userAttributes.find((attr) =>
          attr.pointId.includes(CommunityBadgeCategoryType.westernzodiac),
        ),
      ),
    },
    actions: {
      refreshUserAttributes: () => {
        getUserAttributes();
      },
    },
  };
};
