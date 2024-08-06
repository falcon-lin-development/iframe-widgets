/**
 * @dev This is the onboarding Tutorial page
 * only accessible when the user is authenticated but not joined the community
 */
'use client';

// Pages
import React from 'react';
import { NextPage } from 'next';
import ProfilePage from '@/app/[locale]/c/(tabs)/profile/page';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// components
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Modal,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { Star, X } from 'lucide-react';
import Image from 'next/image';
import assets from '@/constants';
import colors from '@/styles/colors.config';
import { NavBarIconButton } from '@/components/navbars/BottomNavBar.client';
import HighLightedWidget from '@/components/badges/HighLightedWidget';
import TutorialBubble from '@/components/dialogs/TutorialBubble.client';

//hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useFixedPos } from '@/utils/usePosition';

// constants
import routes from '@/routes/routes';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { UIFlows } from '@/data/graphql/models/PersonaCommunityProfile';

const _useOnboardingPageState = () => {
  const { community } = useCommunity();
  const { communityProfile, isProfileInit } = useCommunityProfile(community);

  return {
    state: {
      community,
      communityProfile,
      isPageInit: isProfileInit,
    },
    actions: {},
  };
};

const ProfileOnboardingTutorialPage: React.FC = () => {
  const {
    state: { community, communityProfile, isPageInit },
  } = _useOnboardingPageState();
  const [IsGMOpen, setIsGMOpen] = React.useState(true);
  const { v } = useFixedPos({ left: 105, maxWidth: 375 });
  const { constructPath } = useAppRouting();

  return (
    <>
      <ProfilePage />
      <Modal
        open={true}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="tw-max-w-mobile" height={'100%'} width={'100%'}>
          {!IsGMOpen && (
            <>
              <TutorialBubble
                image={assets.images.app.defaultAvatar}
                title={'Collect” Space'}
                content={'Click the “Collect” to find out the attributes.'}
                sx={{
                  height: '88px',
                  width: '250px',
                  borderRadius: '8px',
                  padding: '16px',
                  // position
                  position: 'absolute',
                  bottom: '64px',
                  left: `${v}px`,
                }}
              />

              <NavButtonHighlighted
                sx={{
                  position: 'absolute',
                  bottom: '0px',
                  left: `${v}px`,
                }}
                href={constructPath(routes.c.quizzes._home, {
                  searchParams: {
                    // tutorial: Tutorials.ONBOARDING,
                  },
                })}
              />
            </>
          )}
        </Box>
      </Modal>
      <GMPopup open={IsGMOpen} onClose={() => setIsGMOpen(false)} />
    </>
  );
};

export default ProfileOnboardingTutorialPage;

// other components
const GMPopup: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const handleClose: DialogProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent
        sx={{
          padding: '48px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={assets.deprecated.gmPopUp}
          alt="GM"
          width={327}
          height={204}
        />
        <Box sx={{ paddingTop: '1rem' }} />
        <Typography
          variant="titleMedium"
          sx={{ textAlign: 'center', color: colors.neutralSwatch.main[10] }}
        >
          GM! Welcome to Mootiez!
        </Typography>
        <Box sx={{ paddingTop: '8px' }} />
        <Typography
          variant="bodyLarge"
          sx={{
            textAlign: 'center',
            fontFamily: 'Basier Circle',
            color: colors.neutralSwatch.main[30],
          }}
        >
          Let’s get your unique Mootiez avatar by collecting your attributes to
          build your profile.
        </Typography>
        <Box sx={{ paddingTop: '24px' }} />
        <Button
          variant="contained"
          sx={{
            padding: '12px 48px',
            borderRadius: '9999px',
          }}
          onClick={onClose}
        >
          <Typography variant="labelLarge">Let’s Get Started</Typography>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const NavButtonHighlighted: React.FC<{
  sx?: SxProps<Theme>;
  href: string;
}> = ({ sx, href }) => {
  return (
    <>
      <HighLightedWidget sx={sx}>
        <Box
          sx={{
            height: '48px',
            width: '68px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: colors.primarySwatch.main[98],
          }}
        >
          <NavBarIconButton
            name="Collect"
            showText={true}
            icon={<Star size={24} />}
            focusIcon={<Star size={24} />}
            // href={routes.c.quizzes._home}
            href={href}
            active={false}
          />
        </Box>
      </HighLightedWidget>
    </>
  );
};
