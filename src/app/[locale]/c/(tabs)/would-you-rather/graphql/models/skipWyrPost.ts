/**
 * {
  "data": {
    "skipWyrPost": {
      "__typename": "WyrPostResponse",
      "message": "WYR skipped successfully",
      "reference": {
        "response_id": "1716449007170-305626",
        "response_timestamp": 1716449007170,
        "response_type": "skip",
        "response_option_id": "",
        "response_option_text": "",
        "response_extra_content": {},
        "skip_reason": "a",
        "response_stats": {}
      },
      "status": "ok"
    }
  }
}
*/

import { GraphqlError } from '@/data/graphql/errors';

export interface SkipWyrPost extends GraphqlError {
  __typename: string;
  message: string;
  reference: {
    // {
    //     "response_id": "1716449007170-305626",
    //     "response_timestamp": 1716449007170,
    //     "response_type": "skip",
    //     "response_option_id": "",
    //     "response_option_text": "",
    //     "response_extra_content": {},
    //     "skip_reason": "a",
    //     "response_stats": {}
    //   },
    response_id: string;
    response_timestamp: number;
    response_type: string;
    response_option_id: string;
    response_option_text: string;
    response_extra_content: Record<string, any>;
    skip_reason: string;
    response_stats: Record<string, any>;
  };
  status: string;
}

export const SKIP_WYR_POST_MUTATION = `
mutation skipWyrPost(
    $communityId: String!
    $postId: String!
    $skipReason: String!
) {
    skipWyrPost(communityId: $communityId, postId: $postId, skipReason: $skipReason) {
      ... on WyrPostResponse {
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
