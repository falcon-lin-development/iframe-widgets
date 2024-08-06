/**
 *        
    {
        "category": "wyr_notification",
        "clearedAt": 0,
        "content": {
        "text": "1 votes on your postBROKE vs UGLY!",
        "post_id": "1715935242001-2NK3zRRC",
        "link": "/wyr/1715935242001-2NK3zRRC"
        },
        "createdAt": 1715935631555,
        "isRead": false,
        "markCleared": false,
        "notificationId": "wyr_notification:wyr_response:1715935242001-2NK3zRRC",
        "readAt": 0,
        "updatedAt": 1715935631555
    },
 */

import { GraphqlError } from '@/data/graphql/errors';

export enum BackendNotificationCategory {
  wyr_notification = 'wyr_notification',
}

export interface BackendNotification {
  category: BackendNotificationCategory;
  content: {
    text: string;
    post_id: string;
    link: string;
    image_url: string;
  };
  clearedAt: number;
  createdAt: number;
  isRead: boolean;
  markCleared: boolean;
  notificationId: string;
  readAt: number;
  updatedAt: number;
}
