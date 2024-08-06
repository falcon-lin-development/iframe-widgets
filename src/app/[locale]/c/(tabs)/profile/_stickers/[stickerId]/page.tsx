'use client';
import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// skeletons
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// css lib
import {
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import { Info, Trash2, Download, RefreshCcw } from 'lucide-react';

// hooks/helpers
import useCommunity from '@/hooks/useCommunity';
import { Community } from '@/data/services/fetchCommunityService';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import useCommunityStickers from '@/hooks/useCommunityStickers';
import routes from '@/routes/routes';
import {
  CommunityImageFile,
  CommunityImageFileFolder,
  deleteCommunityImageFile,
} from '@/data/repositaries/CommunityImageFileRepo';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { isMobile, isWindows } from 'react-device-detect';

// custom widget
import colors from '@/styles/colors.config';
import MessageDialog from '@/components/dialogs/MessageDialog.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import assets, { ButtonID } from '@/constants';
import { WhatsappIcon } from 'next-share';
import ContentDialog from '@/components/dialogs/ContentDialog.client';
import Mp4Player from '@/components/MP4player';

type Props = {
  params: { stickerId: string };
  searchParams: { extension: string };
};

const _useDownloadStickerHook = ({
  community,
  sticker,
  successDeleteCallBack,
}: {
  community: Community;
  sticker?: CommunityImageFile;
  successDeleteCallBack: () => void;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isConfirmedDelete, setIsConfirmedDelete] = React.useState(false);
  const [isDeleteFailedSnackBarOpen, setIsDeleteFailedSnackBarOpen] =
    React.useState(false);
  const [isShareErrorSnackBarOpen, setIsShareErrorSnackBarOpen] =
    React.useState(false);
  const [isTutorialDialogOpen, setIsTutorialDialogOpen] = React.useState(false);

  const {
    utils: { getBearerToken },
  } = useDGAuth();

  // utils
  const downloadSticker = async () => {
    if (!sticker?.url) return;

    // otherwise, just download the image
    const anchor = document.createElement('a');
    anchor.href = sticker!.url;
    anchor.download = sticker!.id;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    // }
  };

  // function shareImageViaWhatsApp(imageUrl: string) {
  //   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(imageUrl)}`;
  //   window.open(whatsappUrl, '_blank');
  // }

  // delete sticker util
  useEffect(() => {
    const deleteSticker = async () => {
      const { jwtToken } = await getBearerToken();
      try {
        const result = await deleteCommunityImageFile({
          accessToken: jwtToken,
          communityId: community.community_id,
          folder: CommunityImageFileFolder.stickers,
          fileId: sticker!.id,
        });
        if (result) {
          setIsDeleteFailedSnackBarOpen(true);
          successDeleteCallBack();
        } else {
          console.error('Failed to delete sticker');
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (isConfirmedDelete && sticker?.id) {
      deleteSticker();
      setIsConfirmedDelete(false);
    }
  }, [isConfirmedDelete]);

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isConfirmedDelete,
    setIsConfirmedDelete,
    isDeleteFailedSnackBarOpen,
    setIsDeleteFailedSnackBarOpen,
    downloadSticker,
    isShareErrorSnackBarOpen,
    setIsShareErrorSnackBarOpen,
    // shareImageViaWhatsApp
    isTutorialDialogOpen,
    setIsTutorialDialogOpen,
  };
};

const Page: NextPage<Props> = ({
  params: { stickerId },
  searchParams: { extension },
}) => {
  // ========== HOOKS ==========
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
  const router = useRouter();
  const sticker = useMemo(() => {
    return stickers.find((sticker) => sticker.id.startsWith(stickerId));
  }, [stickers]);
  const { logButtonClick } = useLogEvent();

  // ========== STATES ==========
  const _hook = _useDownloadStickerHook({
    community,
    sticker,
    successDeleteCallBack: async () => {
      await refreshStickers();
      router.back();
    },
  });

  // ========== RENDER ==========
  if (!isReadyToRender) {
    return <LoadingPage loadingText="" />;
  }

  return (
    <Scaffold
      appbar={
        <AppBar
          title="Download Sticker"
          backButton={<BackIconButton />}
          rightMostIcon={
            <IconButton
              onClick={() => {
                _hook.setIsTutorialDialogOpen(true);
                logButtonClick(
                  ButtonID.profile.stickers.open_tutorial,
                  `${sticker?.id}`,
                );
              }}
              sx={{}}
            >
              <Info size={24} />
            </IconButton>
          }
        />
      }
      mainBody={
        <>
          <MainBody
            style={{
              // backgroundColor: 'grey',
              padding: '1rem',
            }}
          >
            {sticker && (
              <Image
                key={sticker.id}
                src={sticker?.url}
                alt={sticker.id}
                height={400}
                width={400}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                blurDataURL={sticker.url}
                priority
              />
            )}
            <Box sx={{ paddingTop: '2rem' }} />
            <Box
              id="tool-box"
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                width: '100%',
              }}
            >
              <IconButton
                onClick={(event) => {
                  _hook.downloadSticker();
                  logButtonClick(
                    ButtonID.profile.stickers.download_sticker,
                    `${sticker?.id}`,
                  );
                }}
                sx={{
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.primary,
                  },
                }}
              >
                <Download size={24} color={colors.white} />
              </IconButton>
              {/* <Box
              onClick={(event) => {
                _hook.shareImageViaWhatsApp(sticker!.url);
              }}
              // sx={{
              //   backgroundColor: colors.primary,
              //   '&:hover': {
              //     backgroundColor: colors.primary,
              //   },
              // }}
              >
              <WhatsappIcon size={40} round />
            </Box> */}

              <IconButton
                onClick={(event) => {
                  _hook.setIsDeleteDialogOpen(true);
                  // event.stopPropagation();
                  // deleteSelectedObject();
                }}
                sx={{
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.primary,
                  },
                }}
              >
                <Trash2 size={24} color={colors.white} />
              </IconButton>
            </Box>
          </MainBody>

          <ContentDialog
            open={_hook.isTutorialDialogOpen}
            onClose={(action: boolean) => {
              _hook.setIsTutorialDialogOpen(false);
            }}
            title="How to download image as sticker"
            content={
              <Box
                sx={{
                  color: colors.neutralSwatch.main[40],
                }}
              >
                <Typography
                  variant="bodyMedium"
                  component={'p'}
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  1. Click on the download icon to download the sticker as
                  Image.
                </Typography>
                <Box sx={{ paddingTop: '0.5rem' }} aria-label="spacer" />
                <Typography
                  variant="bodyMedium"
                  component={'p'}
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  2. If you are on a mobile device, you can share the image
                  directly to WhatsApp.
                </Typography>
                <Box sx={{ paddingTop: '0.5rem' }} aria-label="spacer" />
                <Typography
                  variant="bodyMedium"
                  component={'p'}
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  3. Use WhatsApp to create sticker from the image.
                </Typography>
                <Box sx={{ paddingTop: '0.5rem' }} aria-label="spacer" />

                <Mp4Player
                  src={assets.others.tutorial_mp4}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                  }}
                />

                {/* <Image 
                  src={assets.others.tutorial_gif}
                  alt="tutorial"
                  width={400}
                  height={400}
                  priority
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                  }}
                /> */}
              </Box>
            }
          />

          <MessageDialog
            open={_hook.isDeleteDialogOpen}
            onIsConfirm={(isConfirmed: boolean) => {
              _hook.setIsDeleteDialogOpen(false);
              _hook.setIsConfirmedDelete(isConfirmed);
              if (isConfirmed) {
                logButtonClick(
                  ButtonID.profile.stickers.delete_sticker,
                  `${sticker?.id}`,
                );
              }
            }}
            // onConfirm={() => _hook.setIsConfirmedDelete(true)}
            title="Delete Sticker"
            content="Are you sure you want to delete this sticker?"
          />
          <Snackbar
            open={_hook.isDeleteFailedSnackBarOpen}
            autoHideDuration={6000}
            onClose={() => _hook.setIsDeleteFailedSnackBarOpen(false)}
            message="Error: Failed to remove sticker"
          />
          <Snackbar
            open={_hook.isShareErrorSnackBarOpen}
            autoHideDuration={6000}
            onClose={() => {
              _hook.setIsShareErrorSnackBarOpen(false);
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => {
                  _hook.setIsShareErrorSnackBarOpen(false);
                  window.location.reload();
                }}
              >
                <RefreshCcw size={24} />
              </IconButton>
            }
            message="Share didn't complete. Please refresh."
          />
        </>
      }
    />
  );
};

export default Page;
