/**
 * @returns {CommunityProfile}
 * {
  "data": {
    "getPersonaCommunityProfile": {
      "__typename": "PersonaCommunityProfile",
      "persona": {
        "entityId": "dotted",
        "isUserHandleSet": true,
        "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
        "uniqueId": "falcon.lin.development@gmail.com",
        "userHandle": "my handle"
      },
      "joinedAt": 0,
      "externalUid": "c:1770071e-0000-0000-0000-1770071e7000#p:dc337266-5ee2-4b74-a439-4af37facb60a",
      "communityId": "1770071e-0000-0000-0000-1770071e7000",
      "ownReferralCode": "ACRCXOvk",
      "profileAvatarUrl": "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fcdcf56e-ef9b-4fd5-a2df-b12f713f5539.png",
      "profileBio": "",
      "profileName": "falcon asf",
      "referredBy": "NA",
      "states": {
        "current_state": "joined",
        "is_blacklisted": false,
        "is_deleted": false,
        "is_left": false,
        "roles": [
          "member",
          "admin"
        ]
      },
      "updatedAt": 1718078468098,
      "userStoredData": {
        "mbti": {
          "e": "2.5",
          "f": "5.5",
          "is_mbti": "true",
          "channel": "xxxxx",
          "i": "3.5",
          "j": "1",
          "n": "1",
          "p": "3.5",
          "s": "2",
          "t": "2.5",
          "http_referer": "xxxxx",
          "referral_code": "xxxxx",
          "is_male": "1",
          "email": "falcon.lin.development@gmail.com"
        },
        "avatar_gen_time": 1707459090998,
        links: [
          {
            "icon": "",
            "id": "0001",
            "title": "Mootiez Link",
            "tracking_url": "https://lynx.dttd.wtf?k=link%3A7021cd1f-23ee-4eff-86ad-b4caa1dcbfb6%3A0001&l=aHR0cHM6Ly93d3cubW9vdGllei5jb20vZnJpZW5kLWludHJvLz9yZWZlcnJhbGNvZGU9RXNxa3o5ZFUmY2hhbm5lbD1vdGhlcg%3D%3D",
            "url": "https://www.mootiez.com/friend-intro/?referralcode=Esqkz9dU&channel=other"
          }
        ]
      }
    }
  }
}
 */

import { gql } from 'urql';
import { GraphqlError } from '../errors';
import { CommunityProfileLink } from './CommunityProfileLink/createCommunityProfileLink';
import { CommunityStates } from '@/data/repositaries/CommunityProfileRepo';

export interface PersonaCommunityProfile extends GraphqlError {
  /**
   * @dev all attributes should be snake cases
   */

  __typename: 'PersonaCommunityProfile';
  persona: {
    entity_id: string;
    is_user_handle_set: boolean;
    persona_id: string;
    personaId?: string; // pre-processed attribute
    unique_id: string;
    user_handle: string;
    // user_handle_net: string;
  };
  persona_id: string; // pre-processed attribute

  joined_at: number;
  external_uid: string;
  community_id: string;
  own_referral_code: string;
  profile_avatar_url: string;
  profile_bio: string;
  profile_name: string;
  referred_by: string;

  states: {
    current_state: CommunityStates;
    is_blacklisted: boolean;
    is_deleted: boolean;
    is_left: boolean;
    roles: string[];
  };
  updated_at: number;
  user_stored_data: {
    theme?: any;
    mbti: {
      e: string;
      f: string;
      is_mbti: string;
      channel: string;
      i: string;
      j: string;
      n: string;
      p: string;
      s: string;
      t: string;
      http_referer: string;
      referral_code: string;
      is_male: string;
      email: string;
    };
    avatar_gen_time: number;
    [keyof: string]: any;
  };
  links: CommunityProfileLink[];
  data_store?: {
    mbti_avatar?: string; // this one store the original avatar
    onboarding_flow_finished?: boolean;
    // onboarding_flow_checkpoint?: 0 | 1; @dev no checkpoints for onboardingflow
    onboarding_data: {
      pronouns: string;
      personality_type: string;
      ei: string;
      sn: string;
      tf: string;
      jp: string;
    };
    [keyof: string]: any;
  };
}

// export enum Tutorials {
//   ONBOARDING = 'onboarding',
// }

export enum UIFlows {
  ONBOARDING = 'onboarding',
}

export interface CommunityProfileDataStore extends GraphqlError {
  __typename: 'CommunityProfileDataStore';
  data: Record<string, any>;
}

export const GET_PERSONA_COMMUNITY_PROFILE = gql`
  query getPersonaCommunityProfile($communityId: String!) {
    getPersonaCommunityProfile(communityId: $communityId) {
      ... on PersonaCommunityProfile {
        __typename
        persona {
          entityId
          isUserHandleSet
          personaId
          uniqueId
          userHandle
        }
        joinedAt
        externalUid
        communityId
        ownReferralCode
        profileAvatarUrl
        profileBio
        profileName
        referredBy
        states
        updatedAt
        userStoredData
        links
      }
      ... on GraphqlError {
        __typename
        error
        message
        statusCode
      }
    }
    getProfileDatastore(communityId: $communityId) {
      ... on CommunityProfileDataStore {
        __typename
        data
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

`

`;
