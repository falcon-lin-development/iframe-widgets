/**
 * @returns { 
 *  updateCommunityProfilePagePublic,
 *  updatePersonaProfileInfo,
 *  updateProfileDatastore 
 * }
{
  "data": {
    "updatePersonaProfileInfo": {
      "__typename": "SimpleMutationResponse",
      "message": "User profile updated successfully",
      "reference": {},
      "status": "ok"
    },
    "updateProfileDatastore": {
      "__typename": "SimpleMutationResponse",
      "message": "User data store updated successfully",
      "status": "ok",
      "reference": {
        "seo_metadata": "{}",
        "d": {},
        "key": "value1",
        "design": "{}",
        "page_icon_url": "{}"
      }
    },
    "updateCommunityProfilePagePublic": {
      "__typename": "SimpleMutationResponse",
      "message": "User public profile page updated successfully",
      "reference": {
        "persona": {
          "persona_id": "dc337266-5ee2-4b74-a439-4af37facb60a",
          "user_handle": "falcon#6463",
          "profile_name": "asd",
          "profile_avatar_url": "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fcdcf56e-ef9b-4fd5-a2df-b12f713f5539.png",
          "profile_bio": "asdc"
        },
        "community_id": "1770071e-0000-0000-0000-1770071e7000",
        "page_id": "default",
        "page_name": "",
        "page_icon_url": "{}",
        "seo_metadata": {},
        "is_private": false,
        "design": {},
        "layout": {},
        "generated_url": "https://lynx.dttd.wtf?k=profile%3Adefault%3Adc337266-5ee2-4b74-a439-4af37facb60a&l=L2MvcHJvZmlsZS9kYzMzNzI2Ni01ZWUyLTRiNzQtYTQzOS00YWYzN2ZhY2I2MGEvZGVmYXVsdA%3D%3D",
        "created_at": 1719468879123,
        "updated_at": 1719470761532
      },
      "status": "ok"
    }
  }
}
*/

import { gql } from 'urql';
import { GraphqlError } from '../errors';

export interface updatePersonaProfileInfo extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: Record<string, any>;
  status: string;
}

export interface updateProfileDatastore extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  status: string;
  reference: {
    seo_metadata: string;
    d: Record<string, any>;
    key: string;
    design: string;
    page_icon_url: string;
  };
}

export interface updateCommunityProfilePagePublic extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: {
    persona: {
      persona_id: string;
      user_handle: string;
      profile_name: string;
      profile_avatar_url: string;
      profile_bio: string;
    };
    community_id: string;
    page_id: string;
    page_name: string;
    page_icon_url: string;
    seo_metadata: Record<string, any>;
    is_private: boolean;
    design: Record<string, any>;
    layout: Record<string, any>;
    generated_url: string;
    created_at: number;
    updated_at: number;
  };
  status: string;
}

export interface updateProfileData {
  updatePersonaProfileInfo: updatePersonaProfileInfo;
  updateProfileDatastore: updateProfileDatastore;
  updateCommunityProfilePagePublic: updateCommunityProfilePagePublic;
}

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $communityId: String!
    $profileName: String
    $profileBio: String
    $profileAvatarUrl: String
    $dataStore: JSON!
    $pageDesign: JSON
    $pageIconUrl: String
    $pageSeoMetadata: JSON
  ) {
    updatePersonaProfileInfo(
      communityId: $communityId
      profileAvatarUrl: $profileAvatarUrl
      profileBio: $profileBio
      profileName: $profileName
    ) {
      ... on GraphqlError {
        __typename
        error
        message
        statusCode
      }
      ... on SimpleMutationResponse {
        __typename
        message
        reference
        status
      }
    }
    updateProfileDatastore(communityId: $communityId, data: $dataStore) {
      ... on SimpleMutationResponse {
        __typename
        message
        status
        reference
      }
      ... on GraphqlError {
        __typename
        error
        message
        statusCode
      }
    }
    updateCommunityProfilePagePublic(
      communityId: $communityId
      design: $pageDesign
      pageIconUrl: $pageIconUrl
      seoMetadata: $pageSeoMetadata
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
