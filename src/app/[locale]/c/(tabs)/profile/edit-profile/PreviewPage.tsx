'use client';
import { NextPage } from 'next';
import { useState } from 'react';

// components
import Image from 'next/image';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import { CopyIcon, X } from 'lucide-react';

// options
import colors from '@/styles/colors.config';

// hooks
import useCommunity from '@/hooks/useCommunity';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import Link from 'next/link';
import { PublicProfilePage } from '@/app/[locale]/c/(tabs)/profile/v/default/PublicProfilePage';

import { LoadingButton } from '@mui/lab';
import { useEditProfilePageState } from './useEditProfilePageState';

const PreviewPage: NextPage<{
  onClose: () => void;
  state: ReturnType<typeof useEditProfilePageState>;
}> = ({ onClose, state }) => {
  const { community } = useCommunity();
  const {
    state: { editedPagePublic, editedProfile },
    actions: { saveProfile },
  } = state;

  return (
    <>
      <PublicProfilePage
        communityLogo={community.logo_url}
        publicProfile={{
          ...editedPagePublic,
          persona: {
            ...editedPagePublic.persona,
            profileAvatarUrl: editedProfile.profile_avatar_url,
            profileName: editedProfile.profile_name,
            profileBio: editedProfile.profile_bio,
            userHandle: editedProfile.persona.user_handle,
          },
        }}
        // isPreview={true}
      />
      <Box
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: 16,
          left: 16,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            background: colors.secondarySwatch.main[90],
            borderRadius: '9999px',
            padding: '6px',
            ':hover': {
              background: colors.secondarySwatch.main[90],
            },
          }}
        >
          <X color={colors.secondarySwatch.main[10]} size={14} />
        </IconButton>
      </Box>
      <LoadingButton
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          zIndex: 1,

          background: colors.secondarySwatch.main[90],
          color: colors.secondarySwatch.main[10],
          borderRadius: '9999px',
          padding: '4px 16px',

          '&:hover': {
            background: colors.secondarySwatch.main[90],
            color: colors.secondarySwatch.main[10],
          },
        }}
        loading={state.state.isSaving}
        disabled={state.state.isSaving}
        onClick={saveProfile}
      >
        <Typography
          variant="labelLarge"
          sx={{
            opacity: state.state.isSaving ? 0 : 1,
          }}
        >
          Save
        </Typography>
      </LoadingButton>
    </>
  );
};

export default PreviewPage;
