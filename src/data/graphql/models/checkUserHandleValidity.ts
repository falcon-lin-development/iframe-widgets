/**
{
  "data": {
    "checkUserHandleValidity": {
      "__typename": "SimpleMutationResponse",
      "message": "Username availability checked successfully",
      "reference": {
        "user_handle": "fun_you"
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '../errors';

export type CheckUserHandleValidityMutationResponse = {
  checkUserHandleValidity: {
    __typename: string;
    message: string;
    status: string;
    reference: {
      user_handle: string;
    };
  } & GraphqlError;
};

export const CHECK_USER_HANDLE_VALIDITY_MUTATION = `
mutation checkUserHandleValidity(
    $userHandle: String!
) {
    checkUserHandleValidity(
    userHandleRequest: $userHandle
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
