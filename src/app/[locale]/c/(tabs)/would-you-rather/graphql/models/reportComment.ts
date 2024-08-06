/**
 * {
  "data": {
    "reportComment": {
      "__typename": "SimpleMutationResponse",
      "message": "Comment reported successfully",
      "reference": {
        "reported": true,
        "success": true
      },
      "status": "ok"
    }
  }
}
 */

import { GraphqlError } from '@/data/graphql/errors';

export interface ReportComment extends GraphqlError {
  __typename: string;
  message: string;
  reference: {
    reported: boolean;
    success: boolean;
  };
  status: string;
}

export const REPORT_COMMENT_MUTATION = `
mutation reportComment(
    $commentId: String!
    $communityId: String!
    $reason: String!
) {
    reportComment(
        commentId: $commentId,
        communityId: $communityId,
        reason: $reason
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
