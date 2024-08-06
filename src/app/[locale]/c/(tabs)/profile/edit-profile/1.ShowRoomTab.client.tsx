'use client';
import { useMemo, useState } from 'react';

// components
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import UploadButton from '@/components/buttons/UploadButton';
import { CheckIcon } from '@/app/[locale]/auth/login/TnCCheckbox.client';
import AttributeCard from './components/AttributeCard';
import AttributeSelectionSheet from './components/AttributeSelectionSheet.client';
import LoadingCardMedia from '@/components/loadingComponents/LoadingCardMedia';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// model
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import colors from '@/styles/colors.config';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import { BadgeHolding } from '@/data/graphql/models/PersonaAttributeBadges';

// hooks
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';

const ShowroomTab: React.FC<{
  originalAvatarUrl: string;
  editedProfile: PersonaCommunityProfile;
  setEditedProfile: (profile: PersonaCommunityProfile) => void;
  editedPagePublic: CommunityProfilePagePublic;
  setEditedPagePublic: (pagePublic: CommunityProfilePagePublic) => void;
  userAttributes: BadgeHolding[];
  sx?: SxProps<Theme>;
}> = ({
  sx,
  originalAvatarUrl,
  editedProfile,
  editedPagePublic,
  userAttributes,
  setEditedPagePublic,
  setEditedProfile,
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileUrl, setUploadFileUrl] = useState<string | null>(null);
  const selectedAttributes: BadgeHolding[] = useMemo(() => {
    return editedPagePublic?.design?.attributes || [];
  }, [editedPagePublic]);
  const [isAttributeSelectionOpen, setIsAttributeSelectionOpen] =
    useState(false);

  const mootiezVeryFirstImage = editedProfile.data_store?.mbti_avatar;
  const hasThreeImage =
    mootiezVeryFirstImage &&
    mootiezVeryFirstImage !== originalAvatarUrl &&
    uploadFileUrl;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={sx}>
      {/* Avatar Selection */}
      <>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography
            variant="titleLarge"
            color={colors.neutralSwatch.main[30]}
          >
            Avatar
          </Typography>
          <UploadButton
            onFileSelect={(file) => {
              setUploadFileUrl(URL.createObjectURL(file));
              setUploadFile(file);
            }}
          >
            <Typography
              variant="labelLarge"
              color={colors.primarySwatch.main[40]}
              fontFamily={'Neue Metana'}
            >
              Upload
            </Typography>
          </UploadButton>
        </Box>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <Box
          display="flex"
          flexDirection={'row'}
          sx={{
            justifyContent: hasThreeImage ? 'flex-start' : 'space-evenly',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {mootiezVeryFirstImage && (
            <ImageSelectionCard
              imageName={'Mootiez'}
              imageUrl={mootiezVeryFirstImage}
              onImageSelect={(imageUrl) => {
                setEditedProfile(
                  Object.assign({}, editedProfile, {
                    profile_avatar_url: imageUrl,
                  }),
                );
              }}
              isSelected={
                editedProfile.profile_avatar_url === mootiezVeryFirstImage
              }
            />
          )}

          {mootiezVeryFirstImage !== originalAvatarUrl && (
            <ImageSelectionCard
              imageName={'Me'}
              imageUrl={originalAvatarUrl}
              onImageSelect={(imageUrl) => {
                setEditedProfile(
                  Object.assign({}, editedProfile, {
                    profile_avatar_url: imageUrl,
                  }),
                );
              }}
              isSelected={
                editedProfile.profile_avatar_url === originalAvatarUrl
              }
            />
          )}
          {uploadFileUrl && (
            <ImageSelectionCard
              imageName={uploadFile?.name || 'Uploaded'}
              imageUrl={uploadFileUrl}
              onImageSelect={(imageUrl) => {
                setEditedProfile(
                  Object.assign({}, editedProfile, {
                    profile_avatar_url: imageUrl,
                  }),
                );
              }}
              isSelected={editedProfile.profile_avatar_url === uploadFileUrl}
            />
          )}
        </Box>
      </>
      <Box sx={{ paddingTop: '40px' }} aria-label="spacer" />

      {/* Attribute Manage Selection */}
      <>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography
            variant="titleLarge"
            color={colors.neutralSwatch.main[30]}
          >
            Attributes
          </Typography>
          <Button onClick={() => setIsAttributeSelectionOpen(true)}>
            <Typography
              variant="labelLarge"
              color={colors.primarySwatch.main[40]}
              fontFamily={'Neue Metana'}
            >
              Manage
            </Typography>
          </Button>
        </Box>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
            gap: '16px',
          }}
        >
          {selectedAttributes.map((attribute, index) => (
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
        </Box>
        <AttributeSelectionSheet
          key={JSON.stringify(selectedAttributes)}
          open={isAttributeSelectionOpen}
          onClose={() => setIsAttributeSelectionOpen(false)}
          userAttributes={userAttributes}
          selectedAttributes={selectedAttributes}
          saveAttributes={(localSelectedAttributes: BadgeHolding[]) => {
            const newPublicProfilePage = Object.assign({}, editedPagePublic, {
              design: {
                ...editedPagePublic.design,
                attributes: localSelectedAttributes,
              },
            });
            setEditedPagePublic(newPublicProfilePage);
            setIsAttributeSelectionOpen(false);
          }}
        />
      </>
    </Box>
  );
};

export default ShowroomTab;

/****************************************************
 *  Components
 ****************************************************/

const ImageSelectionCard: React.FC<{
  imageName: string;
  imageUrl: string;
  onImageSelect: (imageUrl: string) => void;
  isSelected: boolean;
}> = ({ imageName, imageUrl, onImageSelect, isSelected }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        aspectRatio: '4/5',
        width: '164px',
        border: '2px solid',
        borderColor: isSelected ? colors.primarySwatch.main[40] : colors.white,
        boxShadow: 'none',
      }}
      onClick={() => {
        onImageSelect(imageUrl);
      }}
    >
      <LoadingCardMedia
        component="img"
        image={imageUrl} // Replace with the path to your image
        alt={imageName}
        sx={{
          aspectRatio: '1',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Checkbox
          icon={
            <Box
              sx={{
                width: '20px',
                height: '20px',
                borderRadius: '0.25rem',
              }}
            >
              <CheckBoxOutlineBlankIcon
                sx={{
                  transform: 'translateY(-3px)',
                }}
              />
            </Box>
          }
          checkedIcon={<CheckIcon isChecked={true} />}
          checked={isSelected}
        />
        <Typography variant="titleMedium" sx={{ transform: 'translateY(1px)' }}>
          {imageName.length > 8 ? imageName.slice(0, 5) + '...' : imageName}
        </Typography>
      </Box>
    </Card>
  );
};
