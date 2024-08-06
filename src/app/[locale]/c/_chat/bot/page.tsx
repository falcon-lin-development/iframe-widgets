'use client';

// React / Nextjs
import React from 'react';
import { NextPage } from 'next';
import { useEffect } from 'react';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { Box, CircularProgress, Snackbar, Typography } from '@mui/material';
import colors from '@/styles/colors.config';

// GraphQL
import ChatRoomQuery from '../ChatRoomQuery';
import { useSubscription, useMutation } from 'urql';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';

type PageProps = {
  // params: {
  //     locale: string, chatId: string
  // };
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page: NextPage<PageProps> = ({
  // params: { locale, chatId },
  searchParams,
}) => {
  const botId = 'vibe_bot' || (searchParams.botId as string);
  const [hasError, setHasError] = React.useState(false);
  const [createChatRoomState, createChatRoom] = useMutation(
    ChatRoomQuery.beginChatbotSession,
  );
  const { navigate } = useAppRouting();

  // CreateChatRoom GraphQL Mutation
  const _createChatRoom = () => {
    createChatRoom({ botId: botId })
      .then((v) => {
        if (v.error) {
          console.error(v);
          setHasError(true);
          return;
        }
        const chatId = v.data.beginChatbotSession.roomId;
        navigate(routes.c.chat.bot.guest_chat, {
          options: { chatId },
          doNothingIfCurrent: true,
        });
      })
      .catch((e) => {
        console.error(e);
        setHasError(true);
      });
  };
  useEffect(() => {
    _createChatRoom();
  }, []);

  return (
    <>
      <Scaffold
        appbar={<AppBar backButton={<BackIconButton />} />}
        mainBody={
          <MainBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              textAlign: 'center',
              color: colors.neutralSwatch.main[40],
            }}
          >
            <CircularProgress />
            <Box height={20} aria-label="spacer" />
            <Typography variant="labelLarge">
              Getting a new chat room...
            </Typography>
          </MainBody>
        }
      />
      <Snackbar
        open={hasError}
        message="Chat Room Creation Error"
        autoHideDuration={6000}
        onClose={() => {
          setHasError(false);
        }}
      />
    </>
  );
};

export default Page;
