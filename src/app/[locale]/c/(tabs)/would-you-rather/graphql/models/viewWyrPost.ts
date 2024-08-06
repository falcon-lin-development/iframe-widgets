/**
 * 
{
  "data": {
    "viewWyrPost": {
      "__typename": "WyrPostResponse",
      "message": "WYR post viewed successfully",
      "reference": {
        "viewed": true
      },
      "status": "ok"
    }
  }
}
 */
import { GraphqlError } from '@/data/graphql/errors';

export interface ViewWyrPost extends GraphqlError {
  __typename: string;
  message: string;
  reference: {
    viewed: boolean;
  };
  status: string;
}

export const VIEW_WYR_POST_MUTATION = `
    mutation viewWyrPost(
        $postId: String!
    ) {
        viewWyrPost(postId: $postId) {
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
