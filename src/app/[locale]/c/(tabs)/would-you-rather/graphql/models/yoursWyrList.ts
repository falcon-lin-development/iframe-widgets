import { GraphqlError } from '@/data/graphql/errors';
import { WyrPost } from './WyrPost';

export interface GetYoursWyrList extends GraphqlError {
  __typename: string;
  posts: WyrPost[];
  lastId: string;
}

export const GET_YOURS_WYR_POSTS_QUERY = `
    query getYourWyrList(
        $communityId: String!,
        $lastId: String!,
        $pageSize: Int!
    ) {
        getYourWyrList(communityId: $communityId, lastId: $lastId, pageSize: $pageSize) {
        ... on WyrPostList {
            __typename
            lastId
            posts {
            communityId
            expiryTimestamp
            isEnabled
            isTimeSensitive
            postCategory
            postContent
            postType
            postId
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
