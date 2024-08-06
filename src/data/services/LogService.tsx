// POST /analytics-tracking/log-event
// POST /analytics-tracking/profile-event
import apiService from '../base';
import axios, { AxiosResponse } from 'axios';

function utf8ToBase64(str: string | number | boolean) {
  // Firstly, encode the string using encodeURIComponent to escape UTF-8 characters,
  // then encode the escaped string to base64.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt('0x' + p1, 16));
    }),
  );
}

export enum EventName {
  app_session_start = 'app_session_start',
  page_view = 'page_view',
  btn_click = 'btn_click',
  quest_page_view = 'quest_page_view',
  inbox_page_view = 'inbox_page_view',
  reward_page_view = 'reward_page_view',
  profile_page_view = 'profile_page_view',
  join_page_view = 'join_page_view',
  auth_page_view = 'auth_page_view',
  mbti_page_view = 'mbti_page_view',
  quizzes_page_view = 'quizzes_page_view',
  would_you_rather_page_view = 'would_you_rather_page_view',
  would_you_rather_question_page_view = 'would_you_rather_question_page_view',
  would_you_rather_question_replies_page_view = 'would_you_rather_question_replies_page_view',

  // stickers_page
  stickers_page_view = 'stickers_page_view',
  stickers_create_page_view = 'stickers_create_page_view',
  stickers_detail_page_view = 'stickers_detail_page_view',

  // chat
  chat_page_view = 'chat_page_view',

  // SurveyJS
  survey_view = 'survey_view',
  survey_start = 'survey_start',
  survey_progress = 'survey_progress',
  survey_submit = 'survey_submit',

  // flow
  onboarding_page_view = 'onboarding_page_view',
}

export type LogEventParams = {
  app_id: string;
  event_name: EventName;
  event_data: Record<string, any>;
  unique_id: string;
  session_id: string;
  session_data: Record<string, any>;
};

export const logEvent = async ({
  // app_id,
  event_name,
  event_data,
  unique_id,
  session_id,
  session_data,
}: LogEventParams) => {
  try {
    const response: AxiosResponse<boolean> = await apiService.post(
      `/analytics-tracking/log-event`,
      {
        event: utf8ToBase64(
          JSON.stringify({
            app_id: 'connect.mootiez.com',
            event_name,
            event_data,
            unique_id,
            session_id,
            session_data,
          }),
        ),
      },
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
    // supress error
    // throw error;
  }
};

export enum ProfileEventName {
  profile_page_view = 'profile_page_view',
  profile_page_link_click = 'profile_page_link_click',
  profile_page_attribute_click = 'profile_page_attribute_click',
  profile_page_referral_click = 'profile_page_referral_click',
  profile_page_wyr_click = 'profile_page_wyr_click',
}

export const logProfileEvent = async (params: {
  person_id: string;
  user_handle: string;
  // community_id: string;
  page_id: string;
  event_name: string;
  event_data: Record<string, any>;
}) => {
  try {
    // console.log('logProfileEvent params:', params);
    const response: AxiosResponse<boolean> = await apiService.post(
      `/analytics-tracking/profile-event`,
      {
        event: utf8ToBase64(
          JSON.stringify({
            persona_id: params.person_id,
            user_handle: params.user_handle,
            community_id: '1770071e-0000-0000-0000-1770071e7000',
            page_id: params.page_id,
            event_name: params.event_name,
            event_data: params.event_data,
          }),
        ),
      },
    );
    // console.log('logProfileEvent response:', response);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
    // supress error
    // throw error;
  }
};
