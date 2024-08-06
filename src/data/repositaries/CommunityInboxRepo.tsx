// GET /api/v1/client/inbox/community-inbox-messages
// POST /api/v1/client/inbox/mark-read-message

import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
import dbInboxs from '@/data/db/inboxs.json';

/**
 * {
  "count": 2,
  "has_next": false,
  "next_value": null,
  "results": [
    {
      "community_id": "1770071e-0000-0000-0000-1770071e7000",
      "persona_id": "dc337266-5ee2-4b74-a439-4af37facb60a",
      "msg_id": "1707185735635-JszfaNpN",
      "msg_type": "quest",
      "created_at": 1707185735635,
      "updated_at": 1707185735635,
      "msg_title": "Free Tokens for You",
      "msg_img_url": "https://i.pravatar.cc/300?u=quest-1707185735635-JszfaNpN",
      "is_content_external_link": false,
      "content_external_link": "",
      "msg_content": {},
      "has_cta": false,
      "cta_content": {},
      "custom_data": {},
      "is_read": false,
      "read_at": 0,
      "mark_deleted": false,
      "deleted_at": 0
    },
    {
      "community_id": "1770071e-0000-0000-0000-1770071e7000",
      "persona_id": "dc337266-5ee2-4b74-a439-4af37facb60a",
      "msg_id": "1707185732836-CmAiUSB3",
      "msg_type": "news",
      "created_at": 1707185732836,
      "updated_at": 1707185732836,
      "msg_title": "Conquer the Challenge",
      "msg_img_url": "https://i.pravatar.cc/300?u=news-1707185732836-CmAiUSB3",
      "is_content_external_link": false,
      "content_external_link": "",
      "msg_content": {},
      "has_cta": false,
      "cta_content": {},
      "custom_data": {},
      "is_read": false,
      "read_at": 0,
      "mark_deleted": false,
      "deleted_at": 0
    }
  ],
  "next": null
}
 */

export interface CommunityInboxMessage {
  community_id: string;
  persona_id: string;
  msg_id: string;
  msg_type: string;
  created_at: number;
  updated_at: number;
  msg_title: string;
  msg_img_url: string;
  is_content_external_link: boolean;
  content_external_link: string;
  msg_content: any;
  has_cta: boolean;
  cta_content: any;
  custom_data: any;
  is_read: boolean;
  read_at: number;
  mark_deleted: boolean;
  deleted_at: number;
}

export interface CommunityInboxMessagesList {
  count: number;
  has_next: boolean;
  next_value: any;
  next: any;
  results: CommunityInboxMessage[];

  last_msg_id: string;
  page_size: number;
  latest_descending: boolean;
}

export type fetchCommunityInboxMessagesParams = {
  communityId: string;
  accessToken: string;
  last_msg_list?: CommunityInboxMessagesList;
};

export const fetchCommunityInboxMessagesService = async (
  params: fetchCommunityInboxMessagesParams,
  refresh = false,
): Promise<CommunityInboxMessagesList> => {
  try {
    const { communityId, accessToken, last_msg_list } = params;
    const url = '/api/v1/client/inbox/community-inbox-messages';
    const response = await apiService.get(url, {
      params: {
        community_id: communityId,
        last_msg_id: refresh ? undefined : last_msg_list?.last_msg_id,
        page_size: last_msg_list?.page_size || 20,
        latest_descending: last_msg_list?.latest_descending || true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const messages = response.data.results as CommunityInboxMessage[];
    const allMessages = messages.concat(dbInboxs as CommunityInboxMessage[]);
    const messageList = {
      count: 1 + response.data.count,
      has_next: response.data.has_next,
      next_value: response.data.next_value,
      next: response.data.next,
      results: allMessages,
      last_msg_id: messages[messages.length - 1]?.msg_id,
      page_size: last_msg_list?.page_size || 20,
      latest_descending: last_msg_list?.latest_descending || true,
    };
    return messageList;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const markReadMessage = async ({
  communityId,
  accessToken,
  msgId,
}: {
  communityId: string;
  accessToken: string;
  msgId: string;
}): Promise<boolean> => {
  try {
    console.log('marking message as read');
    const url = '/api/v1/client/inbox/mark-read-message';
    const response = await apiService.post(
      url,
      {
        community_id: communityId,
        msg_id: msgId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
