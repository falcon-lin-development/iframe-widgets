'use client';
// components
import { Box, SxProps, Theme, Typography } from '@mui/material';

import CancellableTextField from '@/components/TextFields/CancellableTextField';

// model
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import colors from '@/styles/colors.config';

const _TextField = CancellableTextField;

const AboutMeTab: React.FC<{
  sx?: SxProps<Theme>;
  editedProfile: PersonaCommunityProfile;
  setEditedProfile: (profile: PersonaCommunityProfile) => void;
}> = ({ sx, editedProfile, setEditedProfile }) => {
  return (
    <Box sx={sx}>
      <Box sx={{ paddingTop: '20px' }} aria-label="spacer" />
      <>
        <Typography
          variant="titleLarge"
          color={colors.neutralSwatch.main[30]}
          fontFamily={'Neue Metana'}
          sx={{}}
        >
          Display Name
        </Typography>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <_TextField
          // label="Name"
          hiddenLabel
          content={editedProfile.profile_name}
          setContent={(str: string) => {
            // editedProfile.profile_name = str;
            // setEditedProfile(Object.assign({}, editedProfile)); // keep replacing the object to trigger re-render
            setEditedProfile(
              Object.assign({}, editedProfile, { profile_name: str }),
            );
          }}
          maxLength={'20'}
        />
      </>
      <Box sx={{ paddingTop: '40px' }} aria-label="spacer" />
      <>
        <Typography
          variant="titleLarge"
          color={colors.neutralSwatch.main[30]}
          fontFamily={'Neue Metana'}
          sx={{}}
        >
          Username
        </Typography>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <_TextField
          hiddenLabel
          // label="Handle"
          content={editedProfile?.persona?.user_handle || ''}
          setContent={(s: string) => {
            // editedProfile.profile_name = str;
            // setEditedProfile(Object.assign({}, editedProfile)); // keep replacing the object to trigger re-render

            s = s.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            setEditedProfile(
              Object.assign({}, editedProfile, {
                persona: {
                  ...editedProfile.persona,
                  user_handle: s,
                },
              }),
            );
          }}
          maxLength={'20'}
        />
      </>
      <Box sx={{ paddingTop: '40px' }} aria-label="spacer" />
      <>
        <Typography
          variant="titleLarge"
          color={colors.neutralSwatch.main[30]}
          fontFamily={'Neue Metana'}
          sx={{}}
        >
          Bio
        </Typography>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <_TextField
          // label="Bio"
          hiddenLabel
          content={editedProfile.profile_bio}
          setContent={(str: string) => {
            // editedProfile.profile_name = str;
            // setEditedProfile(Object.assign({}, editedProfile)); // keep replacing the object to trigger re-render
            setEditedProfile(
              Object.assign({}, editedProfile, { profile_bio: str }),
            );
          }}
          maxLength={'120'}
          multiline
          maxRows={4}
          minRows={4}
        />
      </>
      <Box sx={{ paddingTop: '20px' }} aria-label="spacer" />
    </Box>
  );
};

export default AboutMeTab;
