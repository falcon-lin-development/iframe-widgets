'use client';
import { useEffect, useMemo, useState } from 'react';

// components
import { Box, Checkbox, Grid, SxProps, Theme, Typography } from '@mui/material';

// model
import colors from '@/styles/colors.config';
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';

/****************************************************
 * Appearance Sections
 ****************************************************/
const _useBgSectionOptions = (editedPagePublic: CommunityProfilePagePublic) => {
  const [bgSelectedOptionIndex, setBgSelectedOptionIndex] = useState<number>(0);

  useEffect(() => {
    if (editedPagePublic?.design?.css?.background) {
      const index = ProfileBGOptions.findIndex(
        (option) =>
          option.background === editedPagePublic?.design?.css?.background,
      );
      if (index >= 0) {
        setBgSelectedOptionIndex(index);
      }
    }
  }, []);

  return {
    bgOptions: ProfileBGOptions,
    bgSelectedOptionIndex,
    setBgSelectedOptionIndex,
  };
};
const AppearanceTab: React.FC<{
  editedPagePublic: CommunityProfilePagePublic;
  setEditedPagePublic: (pagePublic: CommunityProfilePagePublic) => void;
  sx?: SxProps<Theme>;
}> = ({ editedPagePublic, setEditedPagePublic, sx }) => {
  const { bgOptions, bgSelectedOptionIndex, setBgSelectedOptionIndex } =
    _useBgSectionOptions(editedPagePublic);

  const bg = useMemo(
    () => bgOptions[bgSelectedOptionIndex],
    [bgSelectedOptionIndex],
  );

  /**
   * Save change to editedPagePublic
   */
  useEffect(() => {
    setEditedPagePublic(
      Object.assign({}, editedPagePublic, {
        design: {
          ...editedPagePublic.design,
          css: {
            ...editedPagePublic.design?.css,
            background: bg.background,
          },
        },
      }),
    );
  }, [bg]);

  return (
    <Box sx={{ ...sx }}>
      {/* <Typography
        variant="titleLarge"
        color={colors.neutralSwatch.main[30]}
        sx={{}}
      >
        Background
      </Typography> */}
      <Box sx={{ paddingBottom: '12px' }} aria-label="spacer"></Box>
      <Grid container spacing={2}>
        {...bgOptions.map((option, index) => {
          return (
            <Grid
              item
              xs={4}
              key={index}
              sx={{
                aspectRatio: '1/1',
              }}
            >
              <Box
                sx={{
                  background: option.background,
                  height: '100%',
                  borderRadius: '8px',
                  position: 'relative',
                  border:
                    bgSelectedOptionIndex === index ? '2px solid' : 'none',
                  borderColor: colors.primarySwatch.lavender[40],
                }}
                onClick={() => setBgSelectedOptionIndex(index)}
              >
                <Checkbox
                  sx={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-checked': {
                      color: colors.primarySwatch.lavender[40], // Change this to your desired checked color
                    },
                  }}
                  checked={bgSelectedOptionIndex === index} // Assuming selectedOptionIndex is the index of the currently selected option
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default AppearanceTab;
