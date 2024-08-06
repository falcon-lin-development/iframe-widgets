// POST /api/v1/client/community-profile/join-community
import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
/**
 * {
  "community_id": "",
  "join_code": "",
  "profile_name": "",
  "profile_bio": "",
  "profile_avatar_url": "",
  "referral_code": "",
  "channel": "",
  "http_referer": ""
}
 */

export interface JoinCommunityParams {
  community_id: string;
  join_code?: string;
  profile_name?: string;
  profile_bio?: string;
  profile_avatar_url?: string;
  referral_code?: string;
  channel?: string;
  http_referer?: string;
  accessToken: string;
}

export const joinCommunity = async ({
  community_id,
  join_code,
  profile_name,
  profile_bio,
  profile_avatar_url,
  referral_code,
  channel,
  http_referer,
  accessToken,
}: JoinCommunityParams): Promise<CommunityProfile> => {
  try {
    console.log(
      'joining community api with data: ',
      'community_id',
      community_id,
      'join_code',
      join_code,
      'profile_name',
      profile_name,
      'profile_bio',
      profile_bio,
      'profile_avatar_url',
      profile_avatar_url,
      'referral_code',
      referral_code,
      'channel',
      channel,
      'http_referer',
      http_referer,
      'accessToken',
      accessToken,
    );
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/join-community`,
      {
        community_id: community_id,
        join_code: join_code,
        profile_name: profile_name,
        profile_bio: profile_bio,
        profile_avatar_url: profile_avatar_url,
        referral_code: referral_code,
        channel: channel,
        http_referer: http_referer,
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
