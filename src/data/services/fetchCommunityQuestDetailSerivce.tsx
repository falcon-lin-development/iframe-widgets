// /api/v1/client/quests/community-quest-detail
import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
import { Quest } from './fetchCommunityQuestsService';

// {
//     "quest": {
//       "community_id": "1770071e-0000-0000-0000-1770071e7000",
//       "quest_id": "1706000458913-pmHUru9w",
//       "quest_type": "survey",
//       "start_timestamp": 1706000020000,
//       "end_timestamp": 1716000020000,
//       "has_no_expiry": false,
//       "show_date_only": false,
//       "privacy": {},
//       "criteria": {},
//       "quest_title": "Airdrop Quest",
//       "extra_status_display": "",
//       "thumbnail_img_path": "https://doritos-public-bucket-dev.s3.ap-southeast-1.amazonaws.com/mootiez/file-uploads/7d353857-83ae-471c-9370-ed5b61fc9306.png",
//       "detail_img_path": "https://doritos-public-bucket-dev.s3.ap-southeast-1.amazonaws.com/mootiez/file-uploads/7d353857-83ae-471c-9370-ed5b61fc9306.png",
//       "quest_content_id": "02d936c6-6a15-4c41-9908-6252fa10ed7b",
//       "has_quota": false,
//       "quota": {
//         "total": "0",
//         "completed": "0"
//       },
//       "reward_definition": {},
//       "created_by": "7021cd1f-23ee-4eff-86ad-b4caa1dcbfb6",
//       "updated_by": "7021cd1f-23ee-4eff-86ad-b4caa1dcbfb6",
//       "created_at": 1706000458913,
//       "updated_at": 1706000458913,
//       "is_hidden": false,
//       "user_state": {
//         "status": "active",
//         "has_responded": false,
//         "responded_at": 0,
//         "criteria_passed": true
//       }
//     },
//     "content": {
//       "quest_content_id": "02d936c6-6a15-4c41-9908-6252fa10ed7b",
//       "quest_id": "1706000458913-pmHUru9w",
//       "content": "{\"title\": \"Airdrop Quest\", \"completedHtml\": \"<h3>Thank you for your feedback</h3>\", \"completedHtmlOnCondition\": [{\"html\": \"<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>\"}, {\"html\": \"<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>\"}], \"pages\": [{\"name\": \"page1\", \"elements\": [{\"type\": \"radiogroup\", \"name\": \"questionSocialMedia\", \"title\": \"What is the Social Media platform you use most?\", \"choices\": [{\"value\": \"Instagram\", \"text\": \"Instagram\"}, {\"value\": \"X\", \"text\": \"X (Previously Twitter)\"}, {\"value\": \"Facebook\", \"text\": \"Facebook\"}, {\"value\": \"LinkedIn\", \"text\": \"LinkedIn\"}, {\"value\": \"LINE\", \"text\": \"LINE\"}, {\"value\": \"WeChat\", \"text\": \"WeChat\"}, {\"value\": \"Weibo\", \"text\": \"Weibo\"}]}, {\"type\": \"text\", \"name\": \"questionName\", \"title\": \"What's your name?\"}]}], \"showQuestionNumbers\": \"off\"}"
//     }
//   }

export type QuestContent = {
  quest_content_id: string;
  quest_id: string;
  content: string; // JSON string
  contentObject: object; // JSON object
};

export type QuestDetail = {
  quest: Quest;
  content: QuestContent;
};

export type fetchCommunityQuestDetailParams = {
  communityId: string;
  questId: string;
  accessToken: string;
};

export const fetchCommunityQuestDetailSerivce = async (
  params: fetchCommunityQuestDetailParams,
): Promise<QuestDetail> => {
  try {
    console.log('fetchCommunityQuestDetailSerivce api');
    const { communityId, questId, accessToken } = params;
    const url = '/api/v1/client/quests/community-quest-detail';
    const response: AxiosResponse = await apiService.get(url, {
      params: {
        community_id: communityId,
        quest_id: questId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const _tempQuestDetail = response.data as QuestDetail;
    // preprocess the response to a entity that can be used by the UI
    _tempQuestDetail.content.contentObject = JSON.parse(
      _tempQuestDetail.content.content,
    );
    return _tempQuestDetail;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
