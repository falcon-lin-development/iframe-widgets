import { cacheExchange, createClient, fetchExchange, gql } from '@urql/core';

const RoomQuery = {
  beginChatbotSession: `
    mutation beginChatbotSession($botId: String!, $communityId: String = "") {
      beginChatbotSession(chatbotId: $botId, communityId: $communityId) {
        ... on ChatRoom {
          __typename
          description
          displayName
          needAuthentication
          roomId
          roomImageUrl
          roomType
        }
        ... on GraphqlError {
          __typename
          error
          message
          statusCode
        }
      }
    }
  `,
  joinChatbotRoom: `
  mutation ($roomId: String!, $communityId: String = "", $guestUserId: String!, $guestDisplayName: String) {
    joinChatbotRoom(
      roomId: $roomId
      communityId: $communityId
      guestDisplayName: $guestDisplayName
      guestUserId: $guestUserId
    ) {
      ... on JoinChatRoomResponse {
        __typename
        chatroom {
          description
          displayName
          needAuthentication
          roomId
          roomImageUrl
          roomType
          roomUsers {
            displayName
            userType
            profileImageUrl
          }
        }
        user {
          displayName
          keyboardStatus
          lastSeenTimestamp
          profileImageUrl
          role
          userId
          userType
        }
      }
      ... on GraphqlError {
        __typename
        message
        error
        statusCode
      }
    }
  }
  `,
  getChatroom: gql`
    query getChatroom($roomId: String!) {
      getChatroom(roomId: $roomId) {
        ... on GraphqlError {
          __typename
          error
          message
          statusCode
        }
        ... on ChatRoom {
          __typename
          description
          displayName
          needAuthentication
          roomId
          roomImageUrl
          roomMessages {
            deliveredTimestamp
            fromUser {
              displayName
              keyboardStatus
              lastSeenTimestamp
              profileImageUrl
              role
              userId
              userType
            }
            isDeleted
            isEdited
            messageContent
            messageId
            messageTimestamp
            messageType
            readTimestamp
            roomId
            sentTimestamp
          }
          roomType
        }
      }
    }
  `,
  sendTextMessageToChatroom: gql`
    mutation ($id: String!, $uuid: String!, $text: String!) {
      sendTextMessageToChatroom(
        roomId: $id
        userId: $uuid
        textMessage: $text
      ) {
        ... on ChatMessage {
          __typename
          deliveredTimestamp
          sentTimestamp
          roomId
          readTimestamp
          messageTimestamp
          messageType
          messageId
          isDeleted
          isEdited
          messageContent
          fromUser {
            displayName
            userId
            lastSeenTimestamp
            keyboardStatus
            profileImageUrl
            role
            userType
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
  `,
  chatRoomMessage: gql`
    subscription chatRoom($roomId: String!) {
      chatRoomMessage(roomId: $roomId) {
        ... on ChatMessageList {
          __typename
          messages {
            deliveredTimestamp
            fromUser {
              displayName
              keyboardStatus
              lastSeenTimestamp
              profileImageUrl
              role
              userId
              userType
            }
            isDeleted
            isEdited
            messageContent
            messageId
            messageTimestamp
            messageType
            readTimestamp
            roomId
            sentTimestamp
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
  `,
};

export default RoomQuery;
