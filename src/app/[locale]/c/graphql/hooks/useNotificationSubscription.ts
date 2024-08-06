'use client';
import { useSubscription, useMutation, useQuery } from 'urql';
import {
  SUBSCRIPT_PERSONA_PROFILE_UPDATES,
  PersonaProfileNotificationList,
} from '../models/PersonaProfileNotificationList';

// community
import { Community } from '@/data/services/fetchCommunityService';

export const useNotificationSubscription = ({
  communityId,
}: {
  // community: Community modify this since this is a global subscription, not wanna update as API call
  communityId: string;
}) => {
  const [personaProfileSubscriptionState] = useSubscription<{
    personaProfileUpdates: PersonaProfileNotificationList;
  }>(
    {
      query: SUBSCRIPT_PERSONA_PROFILE_UPDATES,
      variables: { communityId },
    },
    (_, data) => data,
  );

  return {
    state: {
      personaProfileSubscriptionState,
    },
  };
};
