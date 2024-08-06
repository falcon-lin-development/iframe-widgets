/**
 *         
  {
    "commentId": "wyr#1716807167268-09reba0v::1717485092504-9mdzq10G",
    "communityId": "1770071e-0000-0000-0000-1770071e7000",
    "content": "test",
    "createdAt": 1717485092504,
    "isEdited": false,
    "editedAt": 0,
    "isRemoved": false,
    "removeReason": "",
    "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
    "replyCount": 0,
    "reportCount": 0,
    "updatedAt": 0,
    "rootId": "wyr#1716807167268-09reba0v",
    "votes": 0,
    "userHandle": "",
    "profileName": "",
    "profileAvatarUrl": ""
  },
 */

import { GraphqlError } from '@/data/graphql/errors';
import { PostComment } from './WyrPostComment';

export interface ListPostComments extends GraphqlError {
  __typename: string;
  nextKey: string;
  topLevelCommentCount: number;
  totalCommentCount: number;
  comments: PostComment[];
}

export const List_POST_COMMENT_QUERY = `
query listPostComments(
    $postId: String!,
    $postType: String!,
    $nextKey: String!,
    $pageSize: Int!
    $communityId: String!
) {
    listPostComments(
        postId: $postId,
        postType: $postType,
        nextKey: $nextKey,
        pageSize: $pageSize
        communityId: $communityId
    ) {
      ... on PostCommentList {
        __typename
        comments {
          isLiked
          isEdited
          editedAt
          createdAt
          content
          communityId
          votes
          votesTs
          isRemoved
          personaId
          profileAvatarUrl
          profileName
          removeReason
          replyCount
          reportCount
          rootId
          updatedAt
          userHandle
          commentId
        }
        nextKey
        topLevelCommentCount
        totalCommentCount
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
