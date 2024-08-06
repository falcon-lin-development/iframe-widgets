/**
 * {
  "data": {
    "respondWyrPost": {
      "__typename": "WyrPostResponse",
      "message": "WYR responded successfully",
      "reference": {
        "response_id": "1715850726141-422279",
        "response_timestamp": 1715850726141,
        "response_type": "vote",
        "response_option_id": "1",
        "response_option_text": "kitty",
        "response_extra_content": {},
        "skip_reason": "",
        "response_stats": {
          "total_count": 1,
          "option_count": {
            "1": 1,
            "2": 0
          },
          "skip_count": 0,
          "updated_at": 1715850726141
        }
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';
import { gql } from 'urql';

export interface ResponseWyrPost extends GraphqlError {
  __typename: string;
  message: string;
  reference: {
    response_id: string;
    response_timestamp: number;
    response_type: string;
    response_option_id: string;
    response_option_text: string;
    response_extra_content: Record<string, any>;
    skip_reason: string;
    response_stats: {
      total_count: number;
      option_count: {
        [key: string]: number;
      };
      skip_count: number;
      updated_at: number;
    };
  };
  status: string;
}

export const RESPOND_WYR_POST_MUTATION = gql`
  mutation RespondWyrPost(
    $communityId: String!
    $postId: String!
    $responseOptionId: String!
  ) {
    respondWyrPost(
      communityId: $communityId
      postId: $postId
      responseOptionId: $responseOptionId
    ) {
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
