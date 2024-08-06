/**
 * 
{
  "data": {
    "replyComment": {
      "__typename": "SimpleMutationResponse",
      "message": "Replied to post comment successfully",
      "reference": {
        "comment_id": "wyr#1716807167268-09reba0v::1717637379447-WCnlYYTk::1717646592945-JOmJEIcU",
        "root_id": "wyr#1716807167268-09reba0v",
        "persona_id": "",
        "community_id": "1770071e-0000-0000-0000-1770071e7000",
        "profile_name": "",
        "profile_avatar_url": "",
        "user_handle": "",
        "content": "test-reply-comment",
        "is_edited": false,
        "reply_count": 0,
        "votes": 0,
        "report_count": 0,
        "is_removed": false,
        "remove_reason": "",
        "created_at": 1717637379447,
        "updated_at": 0,
        "edited_at": 0
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';

export interface addChildComment extends GraphqlError {
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

export const ADD_CHILD_COMMENT_MUTATION = `
mutation replyComment(
    $commentId: String!
    $communityId: String!
    $content: String!
) {
    replyComment(
        commentId: $commentId
        communityId: $communityId
        content: $content
    ) {
      ... on SimpleMutationResponse {
        __typename
        message
        reference
        status
      }
      ... on GraphqlError {
        __typename
        message
        statusCode
        error
      }
    }
  }
`;
