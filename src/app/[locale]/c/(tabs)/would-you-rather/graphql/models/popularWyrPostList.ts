import { GraphqlError } from '@/data/graphql/errors';
import { WyrPost } from './WyrPost';

export interface GetPopularWyrList extends GraphqlError {
  __typename: string;
  posts: WyrPost[];
  lastId: string;
}

export const GET_POPULAR_WYR_POSTS_QUERY = `
query getPopularWyrList(
    $lastId: String!,
    $pageSize: Int!
) {
    getPopularWyrList(lastId: $lastId, pageSize: $pageSize) {
      ... on WyrPostList {
        __typename
        posts {
          expiryTimestamp
          communityId
          isTimeSensitive
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
          postCategory
          postContent
          isEnabled
          createdAt
          userInteraction
        }
        lastId
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
