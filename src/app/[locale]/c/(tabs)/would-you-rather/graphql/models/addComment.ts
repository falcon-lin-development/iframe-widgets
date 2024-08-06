/**
 * {
  "data": {
    "addComment": {
      "__typename": "SimpleMutationResponse",
      "message": "Post comment added successfully",
      "reference": {
        "comment_id": "wyr#1716807167268-09reba0v::1717405858019-L6XBkIAo",
        "root_id": "wyr#1716807167268-09reba0v",
        "persona_id": "dc337266-5ee2-4b74-a439-4af37facb60a",
        "content": "test",
        "is_edited": false,
        "reply_count": 0,
        "votes": 0,
        "report_count": 0,
        "is_removed": false,
        "remove_reason": "",
        "created_at": 1717405858019,
        "updated_at": 0,
        "edited_at": 0
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';

export interface addComment extends GraphqlError {
  _typename: string;
  message: string;
  reference: {
    comment_id: string;
    root_id: string;
    persona_id: string;
    content: string;
    is_edited: boolean;
    reply_count: number;
    votes: number;
    report_count: number;
    is_removed: boolean;
    remove_reason: string;
    created_at: number;
    updated_at: number;
    edited_at: number;
  };
  status: string;
}

export const ADD_COMMENT_MUTATION = `
mutation addComment(
    $content: String!,
    $postId: String!,
    $postType: String!
    $communityId: String!
) {
    addComment(
        content: $content, 
        postId: $postId, 
        postType: $postType
        communityId: $communityId 
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
