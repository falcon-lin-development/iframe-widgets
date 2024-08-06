// import { GraphqlError } from '@/data/graphql/errors';
import { WyrPost } from './WyrPost';
export type { WyrPost };

export const GET_RANDOM_WYR_POST_QUERY = `
query suggestRandomWyr(
    $communityId: String!
) {
    suggestRandomWyr(communityId: $communityId) {
      ... on WyrPost {
        __typename
        communityId
        expiryTimestamp
        isEnabled
        isTimeSensitive
        postCategory
        postContent
        postId
        postType
        sortId
        sponsorId
        sponsorInfo
        startTimestamp
        status
        tags
        userDetails
        viewStats
        createdAt
        userInteraction
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
