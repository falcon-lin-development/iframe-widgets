import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import AppIcon from '@/components/AppIcon';
import LoadingCardMedia from '@/components/loadingComponents/LoadingCardMedia';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import useLogProfileEvent from '@/hooks/useLogProfileEvent';
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import colors from '@/styles/colors.config';

import { AttributeSection, LinksSection } from './PublicProfilePage';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const PublicProfilePageWithTutorial: React.FC<{
  communityLogo: string;
  publicProfile: CommunityProfilePagePublic;
  // isPreview?: boolean;
  bottomCTA?: React.ReactNode;
}> = ({ communityLogo, publicProfile, bottomCTA }) => {
  const { navigate } = useAppRouting();
  const [showContent, setShowContent] = useState(false);
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
            {!showContent && (
              <>
                <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    width: '343px',
                    height: '118px',
                    borderRadius: '8px',
                    background:
                      'linear-gradient(122.94deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setShowContent(true);
                    }}
                    sx={{
                      position: 'absolute',
                      right: '0px',
                      top: '0px',
                    }}
                  >
                    <XIcon size={18} />
                  </IconButton>
                  <Typography
                    variant="titleMedium"
                    color={colors.neutralSwatch.main[30]}
                  >
                    Here is your public profile.
                  </Typography>
                  <Box paddingTop={'12px'} aria-label="spacer" />
                  <Typography
                    variant="titleMedium"
                    color={colors.primarySwatch.main[40]}
                  >
                    Customise and Share it!
                  </Typography>
                </Box>
              </>
            )}

            {showContent && (
              <>
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
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
                </MotionBox>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
