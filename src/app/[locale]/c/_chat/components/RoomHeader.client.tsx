import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import assets from '@/constants';
import colors from '@/styles/colors.config';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useChatRoom } from '../bot/guest/[chatId]/ChatRoomContextProvider';
import ChatRoomQuery from '../ChatRoomQuery';
import { useQuery } from 'urql';

const RoomHeader: React.FC = () => {
  const {
    state: { roomId, joinChatbotRoomState, chatRoomState },
  } = useChatRoom();

  return (
    <AppBar
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 10,
        backgroundColor: colors.toRGBA(colors.primarySwatch.main[90], 0.75),
        '&::before': {
          content: '""',
          position: 'absolute',
          backdropFilter: 'blur(8px)',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        },
      }}
      className={`tw-max-w-mobile`}
      backButton={<BackIconButton />}
      mainIcon={
        <Box
          sx={{
            padding: '2px',
          }}
        >
          {!chatRoomState.fetching && (
            <Avatar
              src={
                chatRoomState.data?.getChatroom.roomImageUrl ||
                assets.images.app.defaultAvatar
              }
              alt="community profile avatar"
              sx={{
                width: '36px',
                height: '36px',
              }}
            />
          )}
        </Box>
      }
      title={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          {!chatRoomState.fetching && (
            <>
              <Typography
                variant="titleMedium"
                sx={{
                  fontFamily: 'Neue Metana, sans-serif',
                }}
              >
                {chatRoomState.data?.getChatroom.displayName}
              </Typography>
              <Typography
                variant="labelMedium"
                sx={{
                  fontFamily: 'Neue Metana, sans-serif',
                  color: colors.neutralSwatch.main[60],
                }}
              >
                {chatRoomState.data?.getChatroom.description}
              </Typography>
            </>
          )}
        </Box>
      }
    />
  );
};

export default RoomHeader;
