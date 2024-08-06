import { GraphqlError } from '@/data/graphql/errors';

export interface ToggleLikeWyrPost extends GraphqlError {
  __typename: string;
  message: string;
  status: string;
  reference: {
    is_liked: boolean;
  };
}

export const TOGGLE_LIKE_WYR_POST_MUTATION = `
mutation toggleLikeWyrPost(
    $isLiked: Boolean!,
    $postId: String!
) {
    toggleLikeWyrPost(isLiked: $isLiked, postId: $postId) {
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
