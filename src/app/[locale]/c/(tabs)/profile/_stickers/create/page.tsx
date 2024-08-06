'use client';
import { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

// skeletons
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
// import { useAppRouting } from "@/app/providers/AppRoutingContextProvider";
import useCommunityStickers from '@/hooks/useCommunityStickers';

// custom widget
import AvatarCaptioner from './AvatarCaptioner';
import { Box, Button, Snackbar, Typography } from '@mui/material';
import useCanvasHook from './useCanvasHook';
import MessageDialog from '@/components/dialogs/MessageDialog.client';

//
import {
  uploadCommunityImageFile,
  CommunityImageFileFolder,
} from '@/data/repositaries/CommunityImageFileRepo';
import colors from '@/styles/colors.config';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

const Page: NextPage = () => {
  const stickerLimits = 3;

  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const {
    state: { stickers, isStickersInit },
    actions: { refreshStickers },
  } = useCommunityStickers(community);

  const isReadyToRender = useMemo(() => {
    return (
      !!community.community_id &&
      !!communityProfile.community_id &&
      isStickersInit
    );
  }, [community, communityProfile, isStickersInit]);

  const canvasHook = useCanvasHook({
    isReadyToRender,
    avatarSrc: communityProfile.profile_avatar_url,
  });
  const [isConfirmSave, setIsConfirmSave] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const router = useRouter();
  const [snackBarOption, setSnackBarOpen] = useState(false);
  const { logButtonClick } = useLogEvent();

  useEffect(() => {
    const saveSticker = async () => {
      const canvas = (canvasHook.canvasRef.current as any).fabric;
      const dataUrl = canvas.toDataURL({
        format: 'image/png',
        multiplier: 3, // Increases the size of the output image
      });
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const file = new File([blob], 'sticker.png', { type: 'image/png' });
      const accessToken = (await getBearerToken()).jwtToken;

      try {
        const result = await uploadCommunityImageFile({
          accessToken,
          communityId: communityProfile.community_id,
          folder: CommunityImageFileFolder.stickers,
          file,
        });
        console.log('Saved sticker', result);
        if (result.id) {
          await refreshStickers();
          router.back();
        } else {
          setSnackBarOpen(true);
          console.error('No result id', result);
        }
      } catch (error) {
        setSnackBarOpen(true);
        console.error('Failed to save sticker', error);
      }
    };

    if (isConfirmSave) {
      // canvasHook.exportCanvasAsPNG();
      saveSticker();
      setIsConfirmSave(false);
    }
  }, [isConfirmSave]);

  if (!isReadyToRender) {
    return <LoadingPage loadingText="" />;
  }

  return (
    <Scaffold
      appbar={
        <AppBar
          title="Create Sticker"
          backButton={<BackIconButton />}
          rightMostIcon={
            <>
              {stickers.length < stickerLimits ? (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    setIsSaveDialogOpen(true);
                  }}
                >
                  Save
                </Button>
              ) : (
                <Typography
                  variant="bodySmall"
                  color={colors.neutralSwatch.main[60]}
                  component="span"
                >
                  {`(${stickers.length}/${stickerLimits})`}
                </Typography>
              )}
            </>
          }
        />
      }
      mainBody={
        <MainBody
          style={{
            padding: '1rem',
          }}
        >
          <AvatarCaptioner canvasHook={canvasHook} />
          <MessageDialog
            open={isSaveDialogOpen}
            onIsConfirm={(isConfirmed: boolean) => {
              setIsSaveDialogOpen(false);
              setIsConfirmSave(isConfirmed);
              if (isConfirmed) {
                logButtonClick(
                  ButtonID.profile.stickers.confirm_save_sticker,
                  '',
                );
              }
            }}
            title="Save Sticker?"
            content="You are going to save the sticker. Are you sure?"
          />
          <Snackbar
            open={snackBarOption}
            sx={{}}
            autoHideDuration={6000}
            onClose={() => setSnackBarOpen(false)}
            message="Error: Failed to save sticker."
          />
        </MainBody>
      }
    />
  );
};

export default Page;
