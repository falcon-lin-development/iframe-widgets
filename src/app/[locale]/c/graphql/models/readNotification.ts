// {
// "__typename": "NotificationUpdateResponse",
// "message": "Notification marked as read",
// "reference": {
//     "notification_id": "wyr_notification:wyr_response:1716457301001-Kw18yZRI"
// },
// "status": "ok"
// }

import { GraphqlError } from '@/data/graphql/errors';

export interface ReadNotification extends GraphqlError {
  message: string;
  reference: {
    notification_id: string;
  };
  status: string;
}

export const READ_NOTIFICATION = `
    mutation readNotification(
        $communityId: String!
        $notificationId: String!
    ) {
        readNotification(
        communityId: $communityId
        notificationId: $notificationId
        ) {
            ... on NotificationUpdateResponse {
                __typename
                message
                reference
                status
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
