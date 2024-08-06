/**
 *         
    {
        "commentId": "wyr#1716807167268-09reba0v::1717637379447-WCnlYYTk::1717645406031-oKLg3PBO",
        "communityId": "1770071e-0000-0000-0000-1770071e7000",
        "content": "test-reply",
        "createdAt": 1717637379447,
        "editedAt": 0,
        "isEdited": false,
        "isRemoved": false,
        "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
        "profileAvatarUrl": "",
        "profileName": "",
        "removeReason": "",
        "replyCount": 0,
        "reportCount": 0,
        "rootId": "wyr#1716807167268-09reba0v",
        "updatedAt": 0,
        "userHandle": "",
        "votes": 0
    }
 */

import { ListPostComments } from './listPostComments';
import { PostComment } from './WyrPostComment';

export interface ListPostChildComments extends ListPostComments {
  comments: PostChildComment[];
}
export type PostChildComment = PostComment;

export const List_POST_CHILD_COMMENT_QUERY = `
    query listPostChildComments(
        $commentId: String!,
        $nextKey: String!,
        $pageSize: Int!
        $communityId: String!
    ){
        listChildPostComments(
            commentId: $commentId, 
            nextKey: $nextKey, 
            pageSize: $pageSize
            communityId: $communityId
        ) {
            ... on PostCommentList {
              __typename
              nextKey
              topLevelCommentCount
              totalCommentCount
              comments {
                commentId
                communityId
                content
                createdAt
                editedAt
                isEdited
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
                votes
                votesTs
                isLiked
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
