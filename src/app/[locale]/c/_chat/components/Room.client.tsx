'use client';
import React, { useEffect, useMemo, useRef } from 'react';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';

// components
import RoomHeader from './RoomHeader.client';
import RoomInputField from './RoomInputField.client';
import {
  Avatar,
  Box,
  Typography,
  ThemeProvider,
  CircularProgress,
  Button,
} from '@mui/material';

// graphql
import RoomQuery from '../ChatRoomQuery';
import { useSubscription, useMutation } from 'urql';

// hook
import { useChatRoom } from '../bot/guest/[chatId]/ChatRoomContextProvider';

// Assets
import assets from '@/constants';
import colors from '@/styles/colors.config';
import mootiezTheme from '@/styles/mui/mootiezTheme';

const MessageBubbleSet: React.FC<{
  sender: string;
  texts: string[];
  isUser?: boolean;
  sendChatMessage?: (args: { text: string }) => void;
}> = ({ sender, texts, isUser = false, sendChatMessage }) => {
  return (
    <>
      <Box
        sx={{
          // text set row
          display: 'flex',
          alignItems: 'center',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <Box // text set column
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            margin: '8px',
            gap: '4px',
            // justifyContent: 'center',
          }}
        >
          {texts.map((text, index) => {
            try {
              const t = JSON.parse(text);
              console.log(t);

              let borderRadius = '';
              if (texts.length === 1) {
                borderRadius = '16px';
              } else if (texts.length > 1) {
                const isFirst = index === 0;
                const isMiddle = index > 0 && index < texts.length - 1;
                const isLast = index === texts.length - 1;
                if (isUser) {
                  borderRadius = isFirst
                    ? '16px 16px 8px 16px'
                    : isLast
                      ? '16px 8px 16px 16px'
                      : '16px 8px 8px 16px';
                } else {
                  borderRadius = isFirst
                    ? '16px 16px 16px 8px'
                    : isLast
                      ? '8px 16px 16px 16px'
                      : '8px 16px 16px 8px';
                }
              }

              return (
                <Box key={index}>
                  <Box
                    sx={{
                      padding: '8px 16px',
                      borderRadius: borderRadius,
                      color: isUser
                        ? colors.neutralSwatch.main[98]
                        : colors.primarySwatch.main[10],
                      backgroundColor: isUser
                        ? colors.primarySwatch.main[30]
                        : colors.primarySwatch.main[98],
                    }}
                  >
                    <Typography
                      style={{ whiteSpace: 'pre-line' }}
                      variant="bodyLarge"
                    >
                      {t.text}
                    </Typography>
                  </Box>
                  {t.options && t.options.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        margin: '4px 0px',
                        gap: '4px',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap', // Add this line to enable wrapping
                        width: 'inherit',
                      }}
                      className="tw-max-w-mobile"
                    >
                      {t.options.map((option: any, index: number) => {
                        return (
                          <Box
                            key={`op_${index}`}
                            onClick={(event) => {
                              event.preventDefault();
                              sendChatMessage &&
                                sendChatMessage({ text: option.text });
                            }}
                            sx={{
                              padding: '8px 16px',
                              borderRadius: '16px',
                              border: `1px solid ${
                                sendChatMessage
                                  ? colors.primarySwatch.main[30]
                                  : colors.neutralSwatch.main[50]
                              }`,
                              cursor: 'pointer',
                              color: sendChatMessage
                                ? colors.primarySwatch.main[10]
                                : colors.primarySwatch.main[50],
                            }}
                          >
                            <Typography variant="bodyLarge">
                              {option.text}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              );
            } catch (e) {
              console.error(e);
              return <></>;
            }
          })}
        </Box>
      </Box>
    </>
  );
};

const Room: React.FC = () => {
  const roomRef = useRef(null);
  const [sessionEnd, setSessionEnd] = React.useState(false);
  const {
    state: {
      roomId,
      userUuid,
      joinChatbotRoomState,
      roomSubscriptionState,
      sendChatMessageState,
      messages: messageBuffer,
      isLoadingMessages,
    },
    utils: { sendChatMessage },
  } = useChatRoom();

  const canSendMessage = useMemo(() => {
    return !sessionEnd && !sendChatMessageState.fetching;
  }, [sessionEnd, sendChatMessageState.fetching]);

  const messages = useMemo(() => {
    if (!messageBuffer || !userUuid) {
      return [];
    }
    const _messages: React.ReactNode[] = [];
    let senderName: string = '';
    let senderId: string = '';
    let senderMessages: string[] = [];

    for (let i = 0; i < messageBuffer.length; i++) {
      const index = i;
      const message = messageBuffer[i];

      if (
        message.messageContent.includes('END_SESSION') ||
        (message.messageContent.includes('END') &&
          message.messageContent.includes('SESSION')) ||
        message.messageContent.includes('END_CHAT')
      ) {
        setSessionEnd(true);
      }

      if (index === 0) {
        senderName = message.fromUser.displayName;
        senderId = message.fromUser.userId;
        senderMessages.push(message.messageContent);
        continue;
      } else {
        if (message.fromUser.userId === senderId) {
          senderMessages.push(message.messageContent);
          continue;
        } else {
          _messages.push(
            <MessageBubbleSet
              key={index}
              sender={senderName}
              texts={senderMessages}
              isUser={senderId === userUuid}
              sendChatMessage={canSendMessage ? sendChatMessage : undefined}
            />,
          );
          senderName = message.fromUser.displayName;
          senderId = message.fromUser.userId;
          senderMessages = [];
          senderMessages.push(message.messageContent);
          continue;
        }
      }
    }
    _messages.push(
      <MessageBubbleSet
        key={messageBuffer.length}
        sender={senderName}
        texts={senderMessages}
        isUser={senderId === userUuid}
        sendChatMessage={canSendMessage ? sendChatMessage : undefined}
      />,
    );

    return _messages;
  }, [canSendMessage, roomSubscriptionState, userUuid]);

  // scroll down for new messages
  useEffect(() => {
    if (roomRef.current) {
      const lastMessage = (roomRef.current as HTMLElement)
        .lastElementChild as HTMLElement;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: 'smooth' });
        console.log('Scrolled to bottom');
      }
    }
  }, [messageBuffer]);

  return (
    <ThemeProvider theme={mootiezTheme}>
      <Scaffold
        mainBody={
          <>
            <RoomHeader />
            <MainBody
              sx={{
                color: 'black',
                backgroundColor: colors.primarySwatch.main[90],
                paddingTop: '52px',
                paddingBottom: '64px',
              }}
              bottomPadding={false}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url(${assets.images.chat.bg})`,
                  backgroundSize: 'contain',
                  backgroundAttachment: 'fixed',
                  backgroundPosition: 'center',
                  zIndex: 0,
                }}
              ></Box>
              <Box
                id="messages"
                sx={{
                  zIndex: 1,
                  width: '100%',
                  padding: '4px',
                }}
                ref={roomRef}
              >
                {messages}
              </Box>
              {isLoadingMessages && <CircularProgress />}
            </MainBody>
          </>
        }
        bottomNavbar={
          sessionEnd ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
              }}
            >
              <Typography
                variant="bodyLarge"
                sx={{
                  color: colors.primarySwatch.main[10],
                }}
              >
                Chat Session Ended
              </Typography>
            </Box>
          ) : (
            <RoomInputField />
          )
        }
      />
    </ThemeProvider>
  );
};

export default Room;
