'use client';
import React, { useMemo, useState } from 'react';

import { NextPage } from 'next';

// skeleton
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import CommunityNavBar from '@/components/navbars/CommunityNavBar.client';
import CommunityAppBar from '@/components/appbars/CommunityAppBar.client';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';

// components
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  CopyIcon,
  LinkIcon,
  LockIcon,
  MoreHorizontalIcon,
  PiIcon,
} from 'lucide-react';
import AttributeCard from './edit-profile/components/AttributeCard';

// constants
import colors from '@/styles/colors.config';
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import { SharableButton } from '@/components/buttons/ShareButton.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import Link from 'next/link';
import assets from '@/constants';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import LoadingCardMedia from '@/components/loadingComponents/LoadingCardMedia';
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';

const useProfilePageState = () => {
  const { community } = useCommunity();
  const { communityProfile, isProfileInit } = useCommunityProfile(community);
  const {
    state: { communityProfilePagePublicInit, communityProfilePagePublic },
  } = useCommunityProfilePagePublic({
    communityId: community.community_id,
    personaId: communityProfile.persona.persona_id,
  });

  const profilePageInit = useMemo(() => {
    return isProfileInit && communityProfilePagePublicInit;
  }, [isProfileInit, communityProfilePagePublicInit]);

  return {
    community,
    communityProfile,
    profilePageInit,
    communityProfilePagePublic,
  };
};

const Page: NextPage = () => {
  const {
    community,
    communityProfile,
    profilePageInit,
    communityProfilePagePublic,
  } = useProfilePageState();

  if (!profilePageInit) {
    return <LoadingPage loadingText="loading profile data" />;
  }

  return (
    <>
      <Scaffold
        appbar={<CommunityAppBar community={community} />}
        bottomNavbar={<CommunityNavBar communityProfile={communityProfile} />}
        mainBody={
          <MainBody
            sx={{
              background: colors.white,
              borderRadius: '24px 24px 0px 0px',
              paddingBottom: '40px',
            }}
          >
            {/* Avatar Card */}
            <AvatarCard
              communityProfile={communityProfile}
              communityProfilePagePublic={communityProfilePagePublic!}
              publicProfileUrl={communityProfilePagePublic!.generatedUrl}
            />

            {/* Main Contents */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '16px',
              }}
            >
              {/* Attributes */}
              <AttributeSection publicProfile={communityProfilePagePublic!} />
              <Box sx={{ paddingTop: '40px' }} aria-label="spacer" />
              <BioSection profile={communityProfile} />
              <Box sx={{ paddingTop: '40px' }} aria-label="spacer" />
              <LinksSection profile={communityProfile} />
            </Box>
          </MainBody>
        }
      />
    </>
  );
};

export default Page;

// other components
const AvatarCard: React.FC<{
  communityProfile: PersonaCommunityProfile;
  communityProfilePagePublic: CommunityProfilePagePublic;
  publicProfileUrl: string;
}> = ({ communityProfile, publicProfileUrl, communityProfilePagePublic }) => {
  const [copyUserHandleSnackbarOpen, setCopyUserHandleSnackbarOpen] =
    useState<boolean>(false);
  const { constructPath, navigate } = useAppRouting();
  const [hasAvatar, setHasAvatar] = useState<boolean>(true);
  const { logButtonClick } = useLogEvent();

  return (
    <Card
      sx={{
        border: '0',
        boxShadow: 'none',
        background:
          communityProfilePagePublic?.design?.css?.background ||
          ProfileBGOptions[0].background,
        width: '100%',
        '&:hover': {
          cursor: 'default',
        },
      }}
    >
      {hasAvatar && (
        <LoadingCardMedia
          component="img"
          image={
            communityProfile.profile_avatar_url ||
            assets.images.app.defaultAvatar
          }
          title={communityProfile.profile_name}
          sx={{
            borderRadius: '8px',
            aspectRatio: '1/1',
          }}
          onError={(e) => {
            console.log('avatar error', e, 'setting default avatar');
            setHasAvatar(false);
          }}
        />
      )}
      {!hasAvatar && (
        <>
          <Box
            sx={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <CardMedia
              component="img"
              image={assets.images.app.defaultAvatar}
              title={communityProfile.profile_name}
              sx={{
                aspectRatio: '1/1',
                filter: 'blur(10px)',
              }}
              onError={(e) => {
                e.currentTarget.src = assets.images.app.defaultAvatar;
              }}
            ></CardMedia>
            <Button
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 'max-content',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '9999px',
                padding: '8px 16px',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.7)',
                },
              }}
              onClick={() => {
                alert('This function is coming soon!');
              }}
              startIcon={<LockIcon size={16} color={colors.white} />}
            >
              <Typography
                variant="labelLarge"
                color={colors.white}
                fontFamily={'Neue Metana'}
                sx={{
                  transform: 'translateY(2px)',
                }}
              >
                Click Here to Unlock Avatar
              </Typography>
            </Button>
          </Box>
        </>
      )}

      {/* Card Content */}
      <Box display={'flex'} flexDirection={'column'}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px 0px 16px',
          }}
        >
          <Typography
            variant="headlineSmall"
            color={colors.white}
            fontFamily={'Neue Metana'}
            textAlign={'left'}
          >
            {communityProfile.profile_name}
          </Typography>
          {/* <IconButton sx={{ color: colors.white }}>
            <MoreHorizontalIcon />
          </IconButton> */}
        </Box>
        <Typography
          variant="labelLarge"
          color={colors.neutralSwatch.main[90]}
          fontFamily={'Neue Metana'}
          textAlign={'left'}
          sx={{
            transform: 'translateY(1px)',
            paddingLeft: '16px',
          }}
        >
          @{communityProfile.persona.user_handle}
          {'  '}
        </Typography>
      </Box>

      {/* Card Actions */}
      {/* <Box sx={{paddingTop: "8px"}} aria-label="spacer"/> */}
      <CardActions
        sx={{
          paddingY: '16px',
          paddingX: '16px',
          gap: '8px',
        }}
      >
        <Button
          // fullWidth
          variant="outlined"
          size="small"
          sx={{
            // flexGrow: 1,
            width: '100%',
            border: '1px solid',
            background:
              'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
            borderColor: colors.toRGBA(colors.white, 0.4),
            '&:hover': {
              background:
                'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
              borderColor: colors.toRGBA(colors.white, 0.8),
            },
          }}
          onClick={() => navigate(routes.c.profile.edit_profile._home)}
        >
          <Typography
            variant="labelLarge"
            sx={{
              color: colors.white,
            }}
          >
            Edit Profile
          </Typography>
        </Button>
        <Button
          href={constructPath(routes.c.profile.v.me._home)}
          // shareProps={{
          //   title: 'Check out my profile on Mootiez',
          //   logButtonClick: logButtonClick,
          //   url: publicProfileUrl,
          // }}
          sx={{
            // flexGrow: 1,
            width: '100%',
            paddingX: 0,
            border: '1px solid',
            background:
              'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
            borderColor: colors.toRGBA(colors.white, 0.4),
            '&:hover': {
              background:
                'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
              borderColor: colors.toRGBA(colors.white, 0.8),
            },
          }}
        >
          <Typography
            variant="labelLarge"
            sx={{
              color: colors.white,
            }}
          >
            Share Profile
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

const AttributeSection: React.FC<{
  publicProfile: CommunityProfilePagePublic;
}> = ({ publicProfile }) => {
  const attributes = publicProfile.design?.attributes || [];

  return (
    <>
      <Box
        display="flex"
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        width="100%"
      >
        <Typography
          variant="titleLarge"
          color={colors.neutralSwatch.main[30]}
          fontFamily={'Neue Metana'}
          textAlign={'left'}
        >
          Attributes
        </Typography>
        {/* <Button
            variant="text"
            sx={{
              '&.MuiButton-root': {
                padding: '0px 8px',
                minWidth: '0px',
              },
            }}
          > */}
        <Link href={routes.c.profile.attributes._home}>
          <Typography
            variant="labelLarge"
            color={colors.primarySwatch.main[40]}
            fontFamily={'Neue Metana'}
            sx={{
              padding: '0px',
            }}
          >
            All
          </Typography>
        </Link>
        {/* </Button> */}
      </Box>
      <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
      <Box
        display={'flex'}
        flexDirection={'row'}
        sx={{
          justifyContent: 'flex-start',
          // justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          width: '100%',
          gap: '16px',
        }}
      >
        {attributes.length > 0 &&
          attributes.map((attribute, index) => (
            <AttributeCard
              key={index}
              attributeBadge={attribute}
              sx={{
                '& .MuiTypography-root': {
                  color: colors.neutralSwatch.main[10],
                },
              }}
            />
          ))}
        {attributes.length === 0 && (
          <Typography
            variant="bodyMedium"
            color={colors.neutralSwatch.main[50]}
            fontFamily={'Basier Circle'}
          >
            No attributes found
          </Typography>
        )}
      </Box>
    </>
  );
};

const BioSection: React.FC<{
  profile: PersonaCommunityProfile;
}> = ({ profile }) => {
  return (
    <>
      <Typography
        variant="titleLarge"
        color={colors.neutralSwatch.main[30]}
        fontFamily={'Neue Metana'}
      >
        Bio
      </Typography>
      <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
      {profile.profile_bio && (
        <Typography
          variant="bodyMedium"
          color={colors.neutralSwatch.main[10]}
          fontFamily={'Basier Circle'}
          sx={{
            textAlign: 'left',
            overflowWrap: 'anywhere',
          }}
        >
          {profile.profile_bio}
        </Typography>
      )}
      {!profile.profile_bio && (
        <>
          <Typography
            variant="bodyMedium"
            color={colors.neutralSwatch.main[50]}
            fontFamily={'Basier Circle'}
          >
            Write a bio...
          </Typography>
        </>
      )}
    </>
  );
};

const LinkCard: React.FC<{
  link: CommunityProfileLink;
}> = ({ link }) => {
  return (
    <Link href={link.tracking_url} target="_blank">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          background: colors.primarySwatch.main[90],
          borderRadius: '9999px',
        }}
      >
        {/* <PiIcon color={colors.primarySwatch.main[40]} size={16} /> */}
        {/* <LinkIcon color={colors.primarySwatch.main[40]} size={16} /> */}
        {/* <Box sx={{ paddingRight: '4px' }} aria-label="spacer" /> */}
        <Typography
          variant="labelMedium"
          color={colors.neutralSwatch.main[10]}
          fontFamily={'Neue Metana'}
          sx={{
            transform: 'translateY(1px)',
          }}
        >
          {link.title}
        </Typography>
      </Box>
    </Link>
  );
};

const LinksSection: React.FC<{
  profile: PersonaCommunityProfile;
}> = ({ profile }) => {
  return (
    <>
      <Typography
        variant="titleLarge"
        color={colors.neutralSwatch.main[30]}
        fontFamily={'Neue Metana'}
      >
        Links
      </Typography>
      <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
      <Box
        display={'flex'}
        flexDirection={'row'}
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
          gap: '8px',
        }}
      >
        {profile.links.map((link) => {
          return <LinkCard key={link.id} link={link} />;
        })}
      </Box>
      {profile.links.length === 0 && (
        <Typography
          variant="bodyMedium"
          color={colors.neutralSwatch.main[50]}
          fontFamily={'Basier Circle'}
        >
          No links found
        </Typography>
      )}
    </>
  );
};
