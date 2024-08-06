/**
 * This page so all the attributes that our user pocesses
 */
'use client';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import Link from 'next/link';
// skeleton
import { Box, Typography, IconButton, Badge } from '@mui/material';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import MainBody from '@/components/MainBody';
import { X } from 'lucide-react';

//hooks
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useMemo } from 'react';
import colors from '@/styles/colors.config';
import AttributeCard from '../edit-profile/components/AttributeCard';
import routes from '@/routes/routes';

const _useProfileAttributesPageState = () => {
  const {
    state: { userAttributes, userAttributesInit },
    actions,
  } = usePersonaAttributeBadges();
  const { community } = useCommunity();
  const { communityProfile, isProfileInit } = useCommunityProfile(community);
  const {
    state: { communityProfilePagePublic, communityProfilePagePublicInit },
  } = useCommunityProfilePagePublic({
    communityId: community.community_id,
    personaId: communityProfile.persona_id,
  });

  const isProfileAttributePageInit = useMemo(() => {
    return (
      userAttributesInit && isProfileInit && communityProfilePagePublicInit
    );
  }, [userAttributesInit, isProfileInit, communityProfilePagePublicInit]);

  return {
    userAttributes,
    communityProfilePagePublic,
    isProfileAttributePageInit,
  };
};

const ProfileAttributesPage: React.FC = () => {
  const {
    userAttributes,
    communityProfilePagePublic,
    isProfileAttributePageInit,
  } = _useProfileAttributesPageState();
  const selectedAttributes =
    communityProfilePagePublic?.design?.attributes || [];

  if (!isProfileAttributePageInit) {
    return <LoadingPage />;
  }

  return (
    <Scaffold
      appbar={
        <AppBar
          backButton={<BackIconButton />}
          title={
            <Typography variant="titleMedium" gutterBottom>
              My Attributes
            </Typography>
          }
        />
      }
      mainBody={
        <MainBody
          sx={{
            padding: '16px',
            // display: 'flex',
            // flexDirection: 'column',
            // justifyContent: 'flex-start',
            // alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
              // gap: '16px',
              gap: '8px',
              width: '100%',
              alignItems: 'start',
              justifyItems: 'center',
            }}
          >
            {userAttributes.length > 0 &&
              userAttributes.map((attribute, index) => {
                const isSelected = Boolean(
                  selectedAttributes.find(
                    (selectedAttribute) =>
                      selectedAttribute.pointId === attribute.pointId,
                  ),
                );
                return (
                  <AttributeCard
                    key={index}
                    sx={{
                      '& .MuiBox-root.attr-icon': {
                        border: isSelected ? '2px solid' : '2px solid',
                        borderColor: isSelected
                          ? colors.primarySwatch.main.primary
                          : colors.primarySwatch.main[90],
                      },
                      '& .MuiTypography-root': {
                        color: colors.neutralSwatch.main[10],
                      },
                    }}
                    attributeBadge={attribute}
                  >
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          borderRadius: '50%',
                          height: '8px',
                          aspectRatio: '1',
                          backgroundColor: colors.primarySwatch.main.primary,
                        }}
                      ></Box>
                    )}
                  </AttributeCard>
                );
              })}
          </Box>
          {userAttributes.length === 0 && (
            <Typography
              variant="bodyMedium"
              color={colors.neutralSwatch.main[50]}
              fontFamily={'Basier Circle'}
            >
              No attributes found,{' '}
              <Link
                href={routes.c.quizzes._home}
                style={{
                  color: colors.primarySwatch.main.primary,
                }}
              >
                click here to claim
              </Link>
            </Typography>
          )}
        </MainBody>
      }
    />
  );
};

export default ProfileAttributesPage;
