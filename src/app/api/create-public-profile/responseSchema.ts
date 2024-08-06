// GraphQL mutations

import { GraphqlError } from '@/data/graphql/errors';
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import { createCommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import {
  BadgeHolding,
  GetPersonaCommunityBadgeBalancesResponse,
  GET_USER_ATTRIBUTES_QUERY,
} from '@/data/graphql/models/PersonaAttributeBadges';
import {
  DROP_ATTRIBUTES_MUTATION,
  DropAttributesMutationResponse,
} from '@/data/graphql/models/dropUserAttribute';

export type {
  BadgeHolding,
  GetPersonaCommunityBadgeBalancesResponse,
  DropAttributesMutationResponse,
};
export { GET_USER_ATTRIBUTES_QUERY, DROP_ATTRIBUTES_MUTATION };

export type CreateProfileResponse = {
  getOrJoinCommunityProfile: PersonaCommunityProfile;
};
export const CREATE_PROFILE_QUERY = `
query CreateProfileQuery (
    $userName: String!
    $bio: String!
    $channel: String!
    $httpReferer: String!
    $referralCode: String!
) {
  getOrJoinCommunityProfile(
    communityId: "1770071e-0000-0000-0000-1770071e7000"
    profileName: $userName
    profileBio: $bio
    channel: $channel
    httpReferer: $httpReferer
    referralCode: $referralCode
  ) {
    ... on GraphqlError {
      __typename
      error
      message
      statusCode
    }
    ... on PersonaCommunityProfile {
      __typename
      communityId
      externalUid
      joinedAt
      links
      ownReferralCode
      persona {
        entityId
        isUserHandleSet
        personaId
        uniqueId
        userHandle
      }
      profileAvatarUrl
      profileBio
      profileName
      referredBy
      social
      states
      updatedAt
      userStoredData
    }
  }
}
`;
export const REMOVE_LINKS_MUTATION = `
mutation RemoveLink(
  $linkId: String!
) {
  removeCommunityProfileLink(
    communityId: "1770071e-0000-0000-0000-1770071e7000", 
    linkId: $linkId
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

export const CREATE_PROFILE_MUTATION = `
mutation CreatePublicProfile(
  $userName: String!
  $bio: String!
  $dataStore: JSON!
) {
    updatePersonaProfileInfo(
      communityId: "1770071e-0000-0000-0000-1770071e7000", 
      profileName: $userName, 
      profileBio: $bio
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
    updateProfileDatastore(
        communityId: "1770071e-0000-0000-0000-1770071e7000"
        data: $dataStore
    ){
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

export const UPDATE_PROFILE_URL_MUTATION = `
mutation UpdateProfileUrl(
    $url: String!
) {
    updatePersonaProfileInfo(
        communityId: "1770071e-0000-0000-0000-1770071e7000"
        profileAvatarUrl: $url
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
    updateProfileDatastore(
        communityId: "1770071e-0000-0000-0000-1770071e7000"
        data: {
            mbti_avatar: $url
        }
    ){
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

export type AddLinkResponse = {
  createCommunityProfileLink: createCommunityProfileLink;
};
export const ADD_LINK_MUTATION = `
mutation MyMutation(
    $title: String!
    $url: String!
) {
    createCommunityProfileLink(
        communityId: "1770071e-0000-0000-0000-1770071e7000", 
        title: $title, 
        url: $url
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

/**
 * @returns
 * {
  "data": {
    "giveawayCommunityBadge": {
      "__typename": "SimpleMutationResponse",
      "message": "istp given away done",
      "reference": {
        "transaction_id": "1720597943914-BbTfKIUk"
      },
      "status": "200"
    }
  }
}
 */

// @dev this "design" updates completely the json field
export const UDPATE_PUBLIC_PROFILE_MUTATION = `
mutation UpdateCommunityProfilePagePublic($designData: JSON) {
  updateCommunityProfilePagePublic(
    design: $designData
    communityId: "1770071e-0000-0000-0000-1770071e7000"
    seoMetadata: ""
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
