'use client';
import React, { useEffect, useMemo, createContext, useState } from 'react';

// graph QL
import ChatRoomQuery from '../../../ChatRoomQuery';
import { useSubscription, useMutation, useQuery } from 'urql';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useAuthRouterStates } from '@/app/providers/AuthRouterStatesContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

// model
import { MessageModel } from '@/data/models/Message';

const _useChatRoom = (roomId: string) => {
  const [roomSubscriptionState] = useSubscription(
    {
      query: ChatRoomQuery.chatRoomMessage,
      variables: { roomId: roomId },
    },
    (_, data) => data,
  );
  const [sendChatMessageState, sendChatMessage] = useMutation(
    ChatRoomQuery.sendTextMessageToChatroom,
  );
  const [joinChatbotRoomState, joinChatbotRoom] = useMutation(
    ChatRoomQuery.joinChatbotRoom,
  );
  const [userUuid, setUserUuid] = React.useState('');
  const { sessionId } = useLogEvent();
  const [hasInitChatRoomError, setHasError] = React.useState(false);
  const [
    { fetching: chatRoomFetching, data: chatRoomData, error },
    refetchChatRoom,
  ] = useQuery({
    query: ChatRoomQuery.getChatroom,
    variables: { roomId },
  });

  const [messageBuffer, setMessageBuffer] = useState<MessageModel[]>([]);
  const isLoadingMessages = useMemo(() => {
    return roomSubscriptionState.fetching || chatRoomFetching;
  }, [chatRoomFetching, roomSubscriptionState.fetching]);

  /**
   * useEffect
   */
  // join chat room
  useEffect(() => {
    joinChatbotRoom({
      roomId: roomId,
      guestUserId: sessionId,
      guestDisplayName: `User-${sessionId.substring(0, 5)}`,
    })
      .then((v) => {
        if (v?.data.joinChatbotRoom.error) {
          if (v.data.joinChatbotRoom.statusCode === 409) {
            // suppress user already exists
            setUserUuid(sessionId);
          } else {
            console.error(v);
            setHasError(true);
          }
          return;
        } else {
          setUserUuid(v.data.joinChatbotRoom.user.userId);
          return;
        }
      })
      .catch((v) => {
        console.error(v);
        setHasError(true);
      });
  }, []);

  // sync fetch chatroom to the buffer
  useEffect(() => {
    if (chatRoomData && chatRoomData.getChatroom?.roomMessages) {
      setMessageBuffer(chatRoomData.getChatroom?.roomMessages);
    }
  }, [chatRoomData]);

  useEffect(() => {
    const subscriptionMessages =
      roomSubscriptionState.data?.chatRoomMessage.messages;
    if (subscriptionMessages) {
      let newBuffer;
      if (messageBuffer.length === 0) {
        newBuffer = subscriptionMessages;
      } else {
        const lastSavedMessageTimeStamp =
          messageBuffer[messageBuffer.length - 1].messageTimestamp;
        newBuffer = [
          ...messageBuffer,
          ...subscriptionMessages.filter(
            (v: MessageModel) => v.messageTimestamp > lastSavedMessageTimeStamp,
          ),
        ];
      }
      setMessageBuffer(newBuffer);
    }
  }, [roomSubscriptionState.data]);

  return {
    state: {
      roomId,
      userUuid,
      hasInitChatRoomError,
      joinChatbotRoomState: {
        fetching: joinChatbotRoomState.fetching,
      },
      roomSubscriptionState: {
        fetching: roomSubscriptionState.fetching,
        data: roomSubscriptionState.data,
      },
      sendChatMessageState: {
        fetching: sendChatMessageState.fetching,
      },
      chatRoomState: {
        fetching: chatRoomFetching,
        data: chatRoomData,
      },
      messages: messageBuffer,
      isLoadingMessages,
    },
    utils: {
      refetchChatRoom,
      sendChatMessage: ({ text }: { text: string }) => {
        sendChatMessage({
          id: roomId,
          uuid: joinChatbotRoomState.data.userId || userUuid,
          text,
        });
      },
    },
  };
};

const ChatRoomContext = createContext<ReturnType<typeof _useChatRoom> | null>(
  null,
);

const ChatRoomContextProvider: React.FC<{
  roomId: string;
  children: React.ReactNode;
}> = ({ roomId, children }) => {
  const value = _useChatRoom(roomId);

  return (
    <ChatRoomContext.Provider value={value}>
      {children}
    </ChatRoomContext.Provider>
  );
};

export const useChatRoom = () => {
  const context = React.useContext(ChatRoomContext);
  if (!context) {
    throw new Error(
      'useRoomContext must be used within a ChatRoomContextProvider',
    );
  }
  return context;
};

export default ChatRoomContextProvider;
