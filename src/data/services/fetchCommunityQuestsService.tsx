/// /api/v1/client/quests/community-quests
import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
import dbQuests from '@/data/db/quests.json';
// {
//     "count": 1,
//     "has_next": false,
//     "next_value": null,
//     "next": null
//     "results": [
//       {
//         "community_id": "1770071e-0000-0000-0000-1770071e7000",
//         "quest_id": "1706000458913-pmHUru9w",
//         "quest_type": "survey",
//         "start_timestamp": 1706000020000,
//         "end_timestamp": 1716000020000,
//         "has_no_expiry": false,
//         "show_date_only": false,
//         "privacy": {},
//         "criteria": {},
//         "quest_title": "Airdrop Quest",
//         "extra_status_display": "",
//         "thumbnail_img_path": "https://doritos-public-bucket-dev.s3.ap-southeast-1.amazonaws.com/mootiez/file-uploads/7d353857-83ae-471c-9370-ed5b61fc9306.png",
//         "detail_img_path": "https://doritos-public-bucket-dev.s3.ap-southeast-1.amazonaws.com/mootiez/file-uploads/7d353857-83ae-471c-9370-ed5b61fc9306.png",
//         "quest_content_id": "02d936c6-6a15-4c41-9908-6252fa10ed7b",
//         "has_quota": false,
//         "quota": {
//           "total": "0",
//           "completed": "0"
//         },
//         "reward_definition": {},
//         "created_by": "7021cd1f-23ee-4eff-86ad-b4caa1dcbfb6",
//         "updated_by": "7021cd1f-23ee-4eff-86ad-b4caa1dcbfb6",
//         "created_at": 1706000458913,
//         "updated_at": 1706000458913,
//         "is_hidden": false,
//         "user_state": {
//           "status": "active",
//           "has_responded": false,
//           "responded_at": 0,
//           "criteria_passed": true
//         }
//       }
//     ],
//  }

enum QuestType {
  survey = 'survey',
  referral = 'referral',

  // poll = 'poll',
  // community = 'community',
  // personal = 'personal',
  // challenge = 'challenge',
  // task = 'task',
  // airdrop = 'airdrop',
  // giveaway = 'giveaway',
  // luckydraw = 'luckydraw',
  // other = 'other',

  // frontend quests
  social = 'social',
  share = 'share',
  myreport = 'myreport',
  quiz = 'quiz',
  event = 'event',
  wouldyourather = 'wouldyourather',
  feature = 'feature', // new feature
}

enum QuestCategory {
  kpop = 'kpop',
  music = 'music',
  gaming = 'gaming',
  misc = 'misc',
  relationships = 'relationships',

  //
  share = 'share',
  game = 'game',
  feature = 'new feature',
}

interface Quest {
  community_id: string;
  quest_id: string;
  quest_type: QuestType;
  start_timestamp: number;
  end_timestamp: number;
  has_no_expiry: boolean;
  show_date_only: boolean;
  privacy: object;
  criteria: object;
  quest_title: string;
  quest_discription?: string;
  quest_subtitle?: string;
  quest_body?: string;
  quest_content?: Record<string, unknown>;
  quest_category?: QuestCategory;

  extra_status_display: string;
  thumbnail_img_path: string;
  detail_img_path: string;
  quest_content_id: string;
  has_quota: boolean;
  quota: {
    total: string;
    completed: string;
  };
  reward_definition: object;
  created_by: string;
  updated_by: string;
  created_at: number;
  updated_at: number;
  is_hidden: boolean;
  user_state: {
    status: string;
    has_responded: boolean;
    responded_at: number;
    criteria_passed: boolean;
  };
}

interface QuestList {
  count: number;
  has_next: boolean;
  next_value: string | null;
  next: string | null;
  quests: Quest[];

  last_quest_id: string;
  page_size: number;
  latest_descending: boolean;
}

type fetchCommunityQuestsParams = {
  communityId: string;
  accessToken: string;
  last_quest_list?: QuestList;
};

const fetchCommunityQuestsService = async (
  params: fetchCommunityQuestsParams,
): Promise<QuestList> => {
  try {
    const { communityId, accessToken, last_quest_list } = params;
    const url = '/api/v1/client/quests/community-quests';
    const response = await apiService.get(url, {
      params: {
        community_id: communityId,
        last_quest_id: last_quest_list?.last_quest_id,
        page_size: last_quest_list?.page_size || 20,
        latest_descending: last_quest_list?.latest_descending || true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let quests = response.data.results as Quest[];
    quests = (dbQuests as Quest[]).concat(quests);
    const questList = {
      count: (dbQuests as Quest[]).length + response.data.count,
      has_next: response.data.has_next,
      next_value: response.data.next_value,
      next: response.data.next,
      quests: quests,
      last_quest_id: quests[quests.length - 1].quest_id,
      page_size: last_quest_list?.page_size || 20,
      latest_descending: last_quest_list?.latest_descending || true,
    } as QuestList;
    return questList;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export type { Quest, QuestList, fetchCommunityQuestsParams };
export { fetchCommunityQuestsService, QuestType };
