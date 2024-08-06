/**
 * 
{
  "data": {
    "toggleLikePostComment": {
      "__typename": "SimpleMutationResponse",
      "message": "Comment like updated successfully",
      "reference": {
        "comment_id": "wyr#1716807167268-09reba0v::1717637379447-WCnlYYTk",
        "voter_id": "c:1770071e-0000-0000-0000-1770071e7000#p:dc337266-5ee2-4b74-a439-4af37facb60a",
        "vote": 1,
        "vote_diff": 0,
        "ignored": true
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';

export interface ToggleLikePostComment extends GraphqlError {
  __typename: string;
  message: string;
  reference: {
    comment_id: string;
    voter_id: string;
    vote: number;
    vote_diff: number;
    ignored: boolean;
  };
  status: string;
}

export const TOGGLE_LIKE_POST_COMMENT_MUTATION = `
mutation toggleLikePostComment(
    $commentId: String!
    $communityId: String!
    $isLiked: Boolean!
){
    toggleLikePostComment(
        commentId: $commentId,
        communityId: $communityId
        isLiked: $isLiked
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
          statusCode
          message
        }
      }
}
`;
