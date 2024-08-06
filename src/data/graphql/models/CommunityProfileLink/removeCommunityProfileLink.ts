/**
 * @returns {removeCommunityProfileLink}
 * 
 * {
  "data": {
    "removeCommunityProfileLink": {
      "__typename": "SimpleMutationResponse",
      "message": "User profile link removed successfully",
      "reference": [
        {
          "id": "0001",
          "title": "a",
          "icon": "c",
          "url": "b",
          "tracking_url": "https://lynx.dttd.wtf?k=link%3Adc337266-5ee2-4b74-a439-4af37facb60a%3A0001&l=Yg%3D%3D"
        },
        {
          "id": "0003",
          "title": "a",
          "icon": "c",
          "url": "b",
          "tracking_url": "https://lynx.dttd.wtf?k=link%3Adc337266-5ee2-4b74-a439-4af37facb60a%3A0003&l=Yg%3D%3D"
        }
      ],
      "status": "ok"
    }
  }
}
 */

import { gql } from 'urql';
import { GraphqlError } from '../../errors';
import { CommunityProfileLink } from './createCommunityProfileLink';

export interface removeCommunityProfileLink extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: CommunityProfileLink[];
  status: string;
}

export const REMOVE_COMMUNITY_PROFILE_LINK = gql`
  mutation removeCommunityProfileLink($communityId: String!, $linkId: String!) {
    removeCommunityProfileLink(communityId: $communityId, linkId: $linkId) {
      ... on SimpleMutationResponse {
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
