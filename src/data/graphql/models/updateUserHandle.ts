/**
 * @returns {updatePersonaUserHandle}
 * 
{
  "data": {
    "updatePersonaUserHandle": {
      "__typename": "SimpleMutationResponse",
      "message": "User handle updated successfully",
      "reference": {
        "user_handle": "falconjai#6463"
      },
      "status": "ok"
    }
  }
}
 */

import { gql } from 'urql';
import { GraphqlError } from '../errors';

export interface updatePersonaUserHandle extends GraphqlError {
  __typename: 'SimpleMutationResponse';
  message: string;
  reference: {
    user_handle: string;
  };
  status: string;
}

export const UPDATE_PERSONA_USER_HANDLE = `
  mutation updatePersonaUserHandle(
    $communityId: String!
    $userHandle: String!
  ) {
    updatePersonaUserHandle(
      communityId: $communityId
      preferredUserHandle: $userHandle
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
