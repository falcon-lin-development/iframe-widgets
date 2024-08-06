/**
 * {
  "data": {
    "listNotifications": {
      "__typename": "PersonaProfileNotificationList",
      "notificationFlag": true,
      "notifications": [
        {
          "category": "wyr_notification",
          "clearedAt": 0,
          "content": {
            "text": "1 votes on your postdoggy vs kitty!",
            "post_id": "1715826631443-WP6kqu30",
            "link": "/c/would-you-rather/1715826631443-WP6kqu30"
          },
          "createdAt": 1716347709516,
          "isRead": false,
          "markCleared": false,
          "notificationId": "wyr_notification:wyr_response:1715826631443-WP6kqu30",
          "readAt": 0,
          "updatedAt": 1716347709516
        }
      ]
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';
import { BackendNotification } from './BackendNotification';

export interface NotificationList extends GraphqlError {
  __typename: string;
  notificationFlag: boolean;
  notifications: BackendNotification[];
}

export const GET_NOTIFICATIONS_QUERY = `
query listNotifications(
    $communityId: String!,
    $lastNotificationId: String!,
    $lastUpdatedAt: Float!,
    $pageSize: Int!
) {
    listNotifications(
        communityId: $communityId,
        lastNotificationId: $lastNotificationId,
        lastUpdatedAt: $lastUpdatedAt,
        pageSize: $pageSize
      ) {
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
`;
