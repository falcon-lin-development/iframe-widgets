/**
 * subscription MySubscription {
  personaProfileUpdates(communityId: "1770071e-0000-0000-0000-1770071e7000") {
    ... on PersonaProfileNotificationList {
      __typename
      notificationFlag
      notifications {
        category
        clearedAt
        content
        createdAt
        isRead
        markCleared
        notificationId
        readAt
        updatedAt
      }
    }
    ... on GraphqlError {
      __typename
      error
      message
      statusCode
    }
  }
}
*/

import { BackendNotification } from './BackendNotification';
import { GraphqlError } from '@/data/graphql/errors';

export interface PersonaProfileNotificationList extends GraphqlError {
  __typename: 'PersonaProfileNotificationList';
  notificationFlag: boolean;
  // notifications: BackendNotification[];
}

export const SUBSCRIPT_PERSONA_PROFILE_UPDATES = `
subscription personaProfileUpdates(
    $communityId: String!
) {
    personaProfileUpdates(communityId: $communityId) {
      ... on PersonaProfileNotificationList {
        __typename
        notificationFlag

      }
      ... on GraphqlError {
        __typename
        error
        message
        statusCode
      }
    }
  }
`;
