'use client';
import { NextPage } from 'next';

// skeletons
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// elements
import {
  Box,
  Card,
  CardMedia,
  CardMediaTypeMap,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import LoadingCardMedia from '@/components/loadingComponents/LoadingCardMedia';

// hooks/helpers
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import useCommunityStickers from '@/hooks/useCommunityStickers';
import routes from '@/routes/routes';
import { useMemo } from 'react';
import colors from '@/styles/colors.config';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';
import { CommunityImageFile } from '@/data/repositaries/CommunityImageFileRepo';

const Page: NextPage = () => {
  const stickerLimits = 3;
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const {
    state: { stickers, isStickersInit },
  } = useCommunityStickers(community);
  const isReadyToRender = useMemo(() => {
    return (
      !!community.community_id &&
      !!communityProfile.community_id &&
      isStickersInit
    );
  }, [community, communityProfile, isStickersInit]);
  const { constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();

  if (!isReadyToRender) {
    return <LoadingPage loadingText="" />;
  }

  return (
    <Scaffold
      appbar={
        <AppBar
          title={
            <>
              My Stickers{' '}
              <Typography
                variant="bodySmall"
                color={colors.neutralSwatch.main[60]}
                component="span"
              >
                {`(${stickers.length}/${stickerLimits})`}
              </Typography>
            </>
          }
          backButton={<BackIconButton />}
          rightMostIcon={
            <>
              {stickers.length < stickerLimits && (
                <Link href={routes.c.profile.stickers.create}>
                  <IconButton onClick={() => {}}>
                    <Plus />
                  </IconButton>
                </Link>
              )}
            </>
          }
        />
      }
      mainBody={
        <MainBody
          style={{
            justifyContent: stickers.length === 0 ? 'center' : 'flex-start',
          }}
        >
          <Grid
            container
            spacing={'1rem'}
            sx={{
              padding: '1rem',
            }}
          >
            {stickers.map((sticker: CommunityImageFile) => (
              <Grid item xs={6} key={sticker.id}>
                <Link
                  href={constructPath(routes.c.profile.stickers.detail._home, {
                    options: { stickerId: sticker.id.split('.')[0] },
                    searchParams: {
                      extension: sticker.id.split('.')[1],
                    },
                  })}
                >
                  <Card variant="outlined">
                    <LoadingCardMedia image={sticker.url} alt={sticker.url} />
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          {stickers.length === 0 && (
            <>
              <Typography
                variant="titleLarge"
                color="textSecondary"
                sx={{
                  padding: 5,
                }}
              >
                You have not created any stickers yet, click the + button to
                create one.
              </Typography>
            </>
          )}
          {stickers.length === stickerLimits && (
            <>
              <Typography
                variant="bodyMedium"
                color="textSecondary"
                sx={{
                  padding: 5,
                }}
              >
                You have reached the maximum number of stickers you can create.
              </Typography>
            </>
          )}
        </MainBody>
      }
    />
  );
};

export default Page;
