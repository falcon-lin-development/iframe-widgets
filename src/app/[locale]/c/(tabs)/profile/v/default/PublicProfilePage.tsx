/**
 * public profile page display
 */
'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import AttributeCard from '@/app/[locale]/c/(tabs)/profile/edit-profile/components/AttributeCard';
import AppIcon from '@/components/AppIcon';
import { ChevronDown, ExternalLink, XIcon } from 'lucide-react';
import LoadingCardMedia from '@/components/loadingComponents/LoadingCardMedia';

//hooks
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';

// constants
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';
import colors from '@/styles/colors.config';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import { BadgeHolding } from '@/app/api/create-public-profile/responseSchema';
import routes from '@/routes/routes';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useLogProfileEvent from '@/hooks/useLogProfileEvent';

const MotionBox = motion(Box);

export const PublicProfilePage: React.FC<{
  communityLogo: string;
  publicProfile: CommunityProfilePagePublic;
  // isPreview?: boolean;
  bottomCTA?: React.ReactNode;
}> = ({ communityLogo, publicProfile, bottomCTA }) => {
  const { navigate } = useAppRouting();
  const {
    logProfileView,
    logProfileLinkClick,
    logProfileAttributeClick,
    logProfileReferralClick,
  } = useLogProfileEvent({
    publicProfile,
  });

  useEffect(() => {
    logProfileView();
  }, []);

  return (
    <>
      <Box
        sx={{
          background:
            publicProfile?.design?.css?.background ||
            ProfileBGOptions[0].background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
        }}
      >
        {/* push widget down if long */}
        <Card
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '0px',
            border: 0,
            boxShadow: 'none',
            // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            background:
              publicProfile?.design?.css?.background ||
              ProfileBGOptions[0].background,
          }}
        >
          <LoadingCardMedia
            key={publicProfile.persona.profileAvatarUrl}
            image={publicProfile.persona.profileAvatarUrl}
            alt={publicProfile.persona.profileName}
            sx={{ width: '100%', aspectRatio: '1/1' }}
          />

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="headlineSmall"
              sx={{
                color: colors.white,
                fontFamily: 'Neue Metana',
                fontWeight: 700,
              }}
            >
              {publicProfile.persona.profileName}
            </Typography>
            <Typography
              variant="labelLarge"
              color={colors.neutralSwatch.main[90]}
              fontFamily={'Neue Metana'}
              sx={{
                transform: 'translateY(1px)',
              }}
            >
              @{publicProfile.persona.userHandle}
              {'  '}
            </Typography>
            {publicProfile.persona.profileBio && (
              <>
                <Box sx={{ paddingTop: '4px' }} aria-label="spacer" />
                <Typography
                  variant="bodyMedium"
                  color={colors.white}
                  fontFamily={'Basier Circle'}
                  sx={{
                    textAlign: 'center',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {publicProfile.persona.profileBio}
                </Typography>
              </>
            )}
            {publicProfile.design?.attributes && (
              <>
                <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
                <AttributeSection
                  attributes={publicProfile.design.attributes}
                  logAttributeClick={logProfileAttributeClick}
                />
              </>
            )}
            {publicProfile.design?.links &&
              publicProfile.design?.links.length > 0 && (
                <>
                  <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
                  <LinksSection
                    links={publicProfile.design.links}
                    logLinkClick={logProfileLinkClick}
                  />
                </>
              )}
            <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
            <AppIcon iconImageUrl={communityLogo} />
            {bottomCTA}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

/**
 * Attribute Section
 */
export const AttributeSection: React.FC<{
  attributes: BadgeHolding[];
  logAttributeClick: (pointId: string) => void;
}> = ({ attributes, logAttributeClick }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      sx={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        gap: '16px',
      }}
    >
      {attributes.map((attribute, index) => (
        <AttributeCard
          key={index}
          attributeBadge={attribute}
          onClick={() => {
            logAttributeClick(attribute.badgeMetadata.point_id);
          }}
        />
      ))}
    </Box>
  );
};

/**
 * Link Section
 * @param param0
 * @returns
 */

export const LinksSection: React.FC<{
  links: CommunityProfileLink[];
  logLinkClick: (linkId: string) => void;
}> = ({ links, logLinkClick }) => {
  const [visibleItems, setVisibleItems] = useState<number>(1);
  const handleShowMore = () => {
    setVisibleItems((prevVisible) => {
      if (prevVisible === links.length) {
        return 1;
      } else {
        return links.length;
      }
    });
  };

  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <List>
          {links.slice(0, visibleItems).map((link, index) => (
            <ListItem key={`${link.id}-${index}`}>
              <LinkTag link={link} logLinkClick={logLinkClick} />
            </ListItem>
          ))}
        </List>
        {visibleItems < links.length && (
          <Button
            onClick={handleShowMore}
            variant="text"
            endIcon={<ChevronDown size={18} />}
            sx={{
              color: colors.white,
              '&:hover': {
                color: colors.white,
              },
            }}
          >
            <Typography
              variant="labelLarge"
              sx={{
                transform: 'translateY(1px)',
              }}
            >
              More
            </Typography>
          </Button>
        )}
      </Box>
    </>
  );
};

export const LinkTag: React.FC<{
  link: CommunityProfileLink;
  logLinkClick: (linkId: string) => void;
}> = ({ link, logLinkClick }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Link href={link.tracking_url} target="_blank"> */}
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '295px',
          height: '40px',
          background:
            'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        onClick={() => {
          setOpen(true);
          logLinkClick(link.id);
        }}
      >
        <Typography
          variant="labelLarge"
          color={colors.white}
          fontFamily={'Neue Metana'}
        >
          {link.title}
        </Typography>
      </Button>
      {/* </Link> */}
      <LinkToExternalSiteDialog
        open={open}
        onClose={() => setOpen(false)}
        targetUrl={link.tracking_url}
        displayUrl={link.url}
      />
    </>
  );
};

export const LinkTagDisplay: React.FC<{
  link: CommunityProfileLink;
}> = ({ link }) => {
  return (
    <>
      {/* <Link href={link.tracking_url} target="_blank"> */}
      <Button
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '295px',
          height: '40px',
          background:
            'linear-gradient(122.94deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        disabled
      >
        <Typography
          variant="labelLarge"
          color={colors.white}
          fontFamily={'Neue Metana'}
        >
          {link.title}
        </Typography>
      </Button>
    </>
  );
};

const LinkToExternalSiteDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  targetUrl: string;
  displayUrl: string;
}> = ({ open, onClose, targetUrl, displayUrl }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          background: colors.neutralSwatch.main[98],
          borderRadius: '8px',
        },
      }}
    >
      <Box
        sx={{
          textAlign: 'right',
          paddingX: '8px',
          paddingTop: '8px',
        }}
      >
        <IconButton
          onClick={() => {
            onClose();
          }}
        >
          <XIcon />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          padding: '0px 36px 48px 36px',
          width: '327px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="titleMedium" color={colors.neutralSwatch.main[10]}>
          Going to...
        </Typography>
        <Box paddingTop={'16px'} aria-label="spacer" />
        <Typography
          variant="bodyLarge"
          color={colors.primarySwatch.main.primary}
          sx={{
            fontFamily: 'Basier Circle',
            overflowWrap: 'anywhere',
          }}
        >
          {/* add https if not exists */}
          {displayUrl && !displayUrl.startsWith('http')
            ? `https://${displayUrl}`
            : displayUrl}
        </Typography>
        <Box paddingTop={'24px'} aria-label="spacer" />

        <Link
          href={targetUrl}
          target="_blank"
          style={{
            width: '100%',
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<ExternalLink size={18} />}
          >
            <Typography variant="labelLarge">Proceed</Typography>
          </Button>
        </Link>
        <Box paddingTop={'16px'} aria-label="spacer" />
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: colors.secondarySwatch.main[90],
            color: colors.secondarySwatch.main[10],
            '&:hover': {
              background: colors.secondarySwatch.main[90],
            },
          }}
          onClick={() => {
            onClose();
          }}
        >
          <Typography variant="labelLarge">Stay</Typography>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
