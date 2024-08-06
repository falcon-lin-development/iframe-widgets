/**
 * @returns {createCommunityProfileLink}
 * {
  "data": {
    "createCommunityProfileLink": {
      "__typename": "SimpleMutationResponse",
      "message": "User profile link created successfully",
      "reference": [
        {
          "id": "0001",
          "title": "a",
          "icon": "c",
          "url": "b",
          "tracking_url": "https://lynx.dttd.wtf?k=link%3Adc337266-5ee2-4b74-a439-4af37facb60a%3A0001&l=Yg%3D%3D"
        },
        {
          "id": "0002",
          "title": "a",
          "icon": "c",
          "url": "b",
          "tracking_url": "https://lynx.dttd.wtf?k=link%3Adc337266-5ee2-4b74-a439-4af37facb60a%3A0002&l=Yg%3D%3D"
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

export interface CommunityProfileLink {
  id: string;
  title: string;
  icon: string;
  url: string;
  tracking_url: string;

  // editing mode
  tempId?: number;
}
export interface createCommunityProfileLink extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: CommunityProfileLink[];
  status: string;
}

export const CREATE_COMMUNITY_PROFILE_LINK = gql`
  mutation createCommunityProfileLink(
    $communityId: String!
    $title: String!
    $url: String!
    $icon: String!
  ) {
    createCommunityProfileLink(
      communityId: $communityId
      title: $title
      url: $url
      icon: $icon
    ) {
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
