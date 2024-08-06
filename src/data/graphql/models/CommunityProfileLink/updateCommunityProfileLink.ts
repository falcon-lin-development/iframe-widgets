/**
 * @returns {updateCommunityProfileLink}
 * 
 * {
  "data": {
    "updateCommunityProfileLink": {
      "__typename": "SimpleMutationResponse",
      "message": "User profile link updated successfully",
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
          "title": "as",
          "icon": "",
          "url": "",
          "tracking_url": "https://lynx.dttd.wtf?k=link%3Adc337266-5ee2-4b74-a439-4af37facb60a%3A0002&l="
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

export interface updateCommunityProfileLink extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: CommunityProfileLink[];
  status: string;
}

export const UPDATE_COMMUNITY_PROFILE_LINK = gql`
  mutation updateCommunityProfileLink(
    $communityId: String!
    $linkId: String!
    $title: String!
    $url: String!
    $icon: String!
  ) {
    updateCommunityProfileLink(
      communityId: $communityId
      linkId: $linkId
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
