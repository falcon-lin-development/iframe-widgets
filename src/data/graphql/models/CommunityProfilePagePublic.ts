/**
 * @returns {CommunityProfilePagePublic}
 *     "getCommunityProfilePagePublic": {
      "__typename": "CommunityProfilePage",
      "communityId": "1770071e-0000-0000-0000-1770071e7000",
      "createdAt": 1719468879123,
      "design": {},
      "generatedUrl": "https://lynx.dttd.wtf?k=profile%3Adefault%3Adc337266-5ee2-4b74-a439-4af37facb60a&l=L2MvcHJvZmlsZS9kYzMzNzI2Ni01ZWUyLTRiNzQtYTQzOS00YWYzN2ZhY2I2MGEvZGVmYXVsdA%3D%3D",
      "layout": {},
      "isPrivate": false,
      "pageIconUrl": "{}",
      "pageId": "default",
      "pageName": "",
      "persona": {
        "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
        "profileAvatarUrl": "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fcdcf56e-ef9b-4fd5-a2df-b12f713f5539.png",
        "profileBio": "asd",
        "profileName": "asd",
        "userHandle": "falcon#6463"
      },
      "seoMetadata": {},
      "updatedAt": 1719469752372
    },
 */

import { gql } from 'urql';

import { GraphqlError } from '../errors';
import { CommunityProfileLink } from './CommunityProfileLink/createCommunityProfileLink';
import { BadgeHolding } from '@/app/api/create-public-profile/responseSchema';

export interface CommunityProfilePagePublic extends GraphqlError {
  __typename: 'CommunityProfilePage';
  communityId: string;
  createdAt: number;
  design?: {
    attributes: BadgeHolding[];
    links?: CommunityProfileLink[];
    css?: {
      background?: string;
      [key: string]: any;
    };
  };
  generatedUrl: string;
  layout: Record<string, any>;
  isPrivate: boolean;
  pageIconUrl: string;
  pageId: string;
  pageName: string;
  persona: {
    ownReferralCode: string;
    personaId: string;
    profileAvatarUrl: string;
    profileBio: string;
    profileName: string;
    userHandle: string;
  };
  seoMetadata: Record<string, any>;
  updatedAt: number;
}

export const GET_COMMUNITY_PROFILE_PAGE_PUBLIC = gql`
  query getCommunityProfilePagePublic(
    $communityId: String!
    $personaId: String!
  ) {
    getCommunityProfilePagePublic(
      communityId: $communityId
      personaId: $personaId
    ) {
      ... on CommunityProfilePage {
        __typename
        communityId
        createdAt
        design
        generatedUrl
        layout
        isPrivate
        pageIconUrl
        pageId
        pageName
        persona {
          ownReferralCode
          personaId
          profileAvatarUrl
          profileBio
          profileName
          userHandle
        }
        seoMetadata
        updatedAt
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

export const GET_COMMUNITY_PROFILE_PAGE_PUBLIC_BY_USER_HANDLE = `
  query getCommunityProfilePagePublicByHandle($userHandle: String!) {
    getCommunityProfilePagePublicByHandle(
      communityId: "1770071e-0000-0000-0000-1770071e7000"
      userHandle: $userHandle
    ) {
      ... on CommunityProfilePage {
        __typename
        communityId
        createdAt
        design
        generatedUrl
        isPrivate
        layout
        pageId
        pageIconUrl
        pageName
        persona {
          ownReferralCode
          personaId
          profileAvatarUrl
          profileBio
          profileName
          userHandle
        }
        seoMetadata
        updatedAt
      }
      ... on GraphqlError {
        __typename
        error
        statusCode
        message
      }
    }
  }
`;
