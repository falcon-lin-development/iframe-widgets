/**
 * 
{
  "data": {
    "getPostComment": {
      "__typename": "PostComment",
      "commentId": "wyr#1716807167268-09reba0v::1717637379447-WCnlYYTk",
      "communityId": "1770071e-0000-0000-0000-1770071e7000",
      "content": "hi",
      "createdAt": 1717637379447,
      "editedAt": 0,
      "isEdited": false,
      "isRemoved": false,
      "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
      "profileAvatarUrl": "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fcdcf56e-ef9b-4fd5-a2df-b12f713f5539.png",
      "profileName": "falcon",
      "removeReason": "",
      "replyCount": 8,
      "reportCount": 0,
      "rootId": "wyr#1716807167268-09reba0v",
      "updatedAt": 0,
      "userHandle": "my handle",
      "votes": 0
    }
  }
}
 */

export interface PostComment {
  commentId: string;
  communityId: string;
  content: string;
  createdAt: number;
  isEdited: boolean;
  editedAt: number;
  isRemoved: boolean;
  removeReason: string;
  personaId: string;
  replyCount: number;
  reportCount: number;
  updatedAt: number;
  rootId: string;
  votes: number;
  userHandle: string;
  profileName: string;
  profileAvatarUrl: string;
  isLiked: boolean;
  votesTs: number;
}

export const GET_POST_COMMENT_QUERY = `
query getPostComment(
    $commentId: String!
) {
    getPostComment(commentId: $commentId) {
      ... on PostComment {
        __typename
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
      ... on GraphqlError {
        __typename
        error
        message
        statusCode
      }
    }
  }
  
  mutation MyMutation {
    __typename
  }
`;
