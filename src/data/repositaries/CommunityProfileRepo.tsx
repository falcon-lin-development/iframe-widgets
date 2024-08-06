// GET /api/v1/client/community-profile/community-profile
// POST /api/v1/client/community-profile/community-profile
// POST /api/v1/client/community-profile/community-profile-stored-data
// POST /api/v1/client/community-profile/append-community-profile-stored-data

import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
import { PersonaCommunityProfile } from '../graphql/models/PersonaCommunityProfile';
// {
//   "persona_id": "dc337266-5ee2-4b74-a439-4af37facb60a",
//   "community_id": "1770071e-0000-0000-0000-1770071e7000",
//   "external_uid": "",
//   "profile_name": "",
//   "profile_bio": "",
//   "profile_avatar_url": "",
//   "own_referral_code": "",
//   "referred_by": "",
//   "states": {
//     "current_state": "joined",
//     "is_blacklisted": false,
//     "is_deleted": false,
//     "is_left": false,
//     "roles": [
//       "member"
//     ]
//   },
//   "user_stored_data": {},
//   "updated_at": 1706002453072
// }
export enum CommunityRoles {
  member = 'member',
  admin = 'admin',
  owner = 'owner',
  moderator = 'moderator',
  guest = 'guest',
}

export enum CommunityStates {
  joined = 'joined',

  // other states
  //   blocked = 'blocked',
  //   banned = 'banned',
  //   muted = 'muted',
  //   restricted = 'restricted',
  //   suspended = 'suspended',
  //   left = 'left',
  //   deleted = 'deleted',
  //   blacklisted = 'blacklisted',
  //   invited = 'invited',
  //   requested = 'requested',
  //   pending = 'pending',
  //   accepted = 'accepted',
  //   rejected = 'rejected',
  //   removed = 'removed',
}

// export interface CommunityProfile {
//   persona_id: string;
//   community_id: string;
//   external_uid: string;
//   profile_name: string;
//   profile_bio: string;
//   profile_avatar_url: string;
//   own_referral_code: string;
//   referred_by: string;
//   states: {
//     current_state: string | CommunityStates;
//     is_blacklisted: boolean;
//     is_deleted: boolean;
//     is_left: boolean;
//     roles: (CommunityRoles | string)[];
//   };
//   user_stored_data: object;
//   updated_at: number;
// }

export type CommunityProfile = PersonaCommunityProfile;

export type fetchCommunityProfileParams = {
  communityId: string;
  accessToken: string;
};

export const fetchCommunityProfile = async ({
  communityId,
  accessToken,
}: fetchCommunityProfileParams): Promise<CommunityProfile> => {
  try {
    const response: AxiosResponse = await apiService.get(
      `/api/v1/client/community-profile/community-profile`,
      {
        params: {
          community_id: communityId.trim(),
        },
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

export const updateCommunityProfile: (props: {
  communityId: string;
  profileName?: string;
  profileBio?: string;
  profileAvatarUrl?: string;
  accessToken: string;
}) => Promise<boolean> = async ({
  communityId,
  profileName,
  profileBio,
  profileAvatarUrl,
  accessToken,
}) => {
  try {
    console.log('updating community profile api', {
      communityId,
      profileName,
      profileBio,
      profileAvatarUrl,
      accessToken,
    });
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/community-profile`,
      {
        community_id: communityId.trim(),
        profile_name: profileName,
        profile_bio: profileBio,
        profile_avatar_url: profileAvatarUrl,
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const updateCommunityProfileStoredData: (props: {
  communityId: string;
  accessToken: string;
  userStoredData: Record<string, any>;
}) => Promise<boolean> = async ({
  communityId,
  accessToken,
  userStoredData,
}) => {
  console.log('updating community profile stored data api');
  try {
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/community-profile-stored-data`,
      {
        community_id: communityId.trim(),
        data: userStoredData,
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const appendCommunityProfileStoredData: (props: {
  communityId: string;
  accessToken: string;
  userStoredData: Record<string, any>;
}) => Promise<boolean> = async ({
  communityId,
  accessToken,
  userStoredData,
}) => {
  console.log('appending community profile stored data api');
  try {
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/append-community-profile-stored-data`,
      {
        community_id: communityId.trim(),
        data: userStoredData,
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
