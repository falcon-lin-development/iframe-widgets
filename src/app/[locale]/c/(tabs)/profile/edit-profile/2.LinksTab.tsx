'use client';
import { use, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// components
import {
  Box,
  Button,
  Dialog,
  IconButton,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import Sheet from 'react-modal-sheet';

import {
  CheckCircle2,
  EditIcon,
  LinkIcon,
  PlusIcon,
  Trash2Icon,
  X,
  XCircle,
} from 'lucide-react';
import CancellableTextField from '@/components/TextFields/CancellableTextField';

// model
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import colors from '@/styles/colors.config';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';

// hooks

import { useMutationCommunityProfileLink } from '@/data/graphql/hooks/useMutationCommunityProfileLink';
import { LoadingButton } from '@mui/lab';
import { useMutationUserProfile } from '@/data/graphql/hooks/useMutationUserProfile';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import {
  AddLinksModal,
  EditLinksModal,
  LinkDisplayCard,
} from '@/app/[locale]/c/(flows)/flow/onboarding/4.links';
import { ProfileLinkInput } from '@/app/api/create-public-profile/requestSchema';
import { useEditProfilePageState } from './useEditProfilePageState';

const AnimatedBox = motion(Box);
const _TextField = CancellableTextField;

/****************************************************
 * Link Sections
 ****************************************************/

const LinksTab: React.FC<{
  state: ReturnType<typeof useEditProfilePageState>;
  sx?: SxProps<Theme>;
}> = ({ state, sx }) => {
  const editedPagePublic = state.state.editedPagePublic;
  const [editLinkInfo, setEditLinkInfo] = useState<{
    isOpen: boolean;
    index?: number;
    link?: ProfileLinkInput;
  }>({
    isOpen: false,
  });
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const publicProfileLinks = useMemo(() => {
    return editedPagePublic?.design?.links || [];
  }, [editedPagePublic]);

  const _addLink = async (link: ProfileLinkInput) => {
    // 1) sync BE communityprofile
    const _createLinkResult = await state.actions.createProfileLink(link);
    const _updatedLinks =
      _createLinkResult.data?.createCommunityProfileLink.reference || [];
    if (!_updatedLinks) {
      console.error(
        'Failed to create link',
        _createLinkResult.data?.createCommunityProfileLink.message,
      );
      return;
    }
    // 2) update edited public profile page
    const _updateProfileResult = await state.actions.updateProfile({
      pageDesign: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    });
    // 3) refresh all
    if (
      _updateProfileResult.data?.updateCommunityProfilePagePublic.status ===
      'ok'
    ) {
      state.actions.refreshAll();
    }
    // @dev hack to update the editedPagePublic, since refresh doesn;t wait for
    // the public page to update
    state.actions.setEditedPagePublic({
      ...editedPagePublic,
      design: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    } as CommunityProfilePagePublic);
  };

  const _editLink = async (linkId: string, link: ProfileLinkInput) => {
    // 1) sync BE communityprofile
    const _updateLinkResult = await state.actions.updateProfileLink({
      linkId,
      title: link.title,
      url: link.url,
    });
    const _updatedLinks =
      _updateLinkResult.data?.updateCommunityProfileLink.reference || [];
    if (!_updatedLinks) {
      console.error(
        'Failed to update link',
        _updateLinkResult.data?.updateCommunityProfileLink.message,
      );
      return;
    }
    // 2) update edited public profile page
    const _updateProfileResult = await state.actions.updateProfile({
      pageDesign: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    });
    // 3) refresh all
    if (
      _updateProfileResult.data?.updateCommunityProfilePagePublic.status ===
      'ok'
    ) {
      state.actions.refreshAll();
    }
    // @dev hack to update the editedPagePublic, since refresh doesn;t wait for
    // the public page to update
    state.actions.setEditedPagePublic({
      ...editedPagePublic,
      design: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    } as CommunityProfilePagePublic);
  };

  const _removeLink = async (linkId: string) => {
    // 1) sync BE communityprofile
    const _deleteLinkResult = await state.actions.removeProfileLink({ linkId });
    const _updatedLinks =
      _deleteLinkResult.data?.removeCommunityProfileLink.reference || [];
    if (!_updatedLinks) {
      console.error(
        'Failed to delete link',
        _deleteLinkResult.data?.removeCommunityProfileLink.message,
      );
      return;
    }
    // 2) update edited public profile page
    const _updateProfileResult = await state.actions.updateProfile({
      pageDesign: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    });
    // 3) refresh all
    if (
      _updateProfileResult.data?.updateCommunityProfilePagePublic.status ===
      'ok'
    ) {
      state.actions.refreshAll();
    }
    // @dev hack to update the editedPagePublic, since refresh doesn;t wait for
    // the public page to update
    state.actions.setEditedPagePublic({
      ...editedPagePublic,
      design: {
        ...editedPagePublic.design,
        links: _updatedLinks,
      },
    } as CommunityProfilePagePublic);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx,
      }}
    >
      <>
        {publicProfileLinks && publicProfileLinks.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              height: '35vh',
            }}
          >
            <Typography
              variant="labelSmall"
              color={colors.neutralSwatch.main[40]}
            >
              You do not have any links yet...
            </Typography>
          </Box>
        )}
        {publicProfileLinks &&
          publicProfileLinks.length > 0 &&
          publicProfileLinks.map((link: CommunityProfileLink, index) => {
            return (
              <LinkDisplayCard
                key={index}
                link={link}
                sx={{
                  marginTop: '16px',
                }}
                onClick={() => {
                  setEditLinkInfo({
                    isOpen: true,
                    index,
                    link,
                  });
                }}
              />
            );
          })}
        <Box sx={{ paddingTop: '24px' }} aria-label="spacer" />
        {publicProfileLinks.length < 5 && (
          <Button
            variant="outlined"
            onClick={() => {
              // block scrolling
              document.body.style.overflowY = 'hidden';
              setIsAddLinkOpen(true);
            }}
            startIcon={<PlusIcon size={18} />}
            sx={{
              padding: '8px 16px',
            }}
          >
            <Typography
              variant="labelLarge"
              color={colors.primarySwatch.main[40]}
              sx={{
                transform: 'translateY(2px)',
              }}
            >
              Add Links
            </Typography>
          </Button>
        )}
        {publicProfileLinks.length >= 5 && (
          <Typography
            variant="labelLarge"
            color={colors.neutralSwatch.main[40]}
            sx={{
              textAlign: 'center',
              paddingTop: '16px',
            }}
          >
            5 links maximum
          </Typography>
        )}
        {/* Modals */}
        <AddLinksModal
          isOpen={isAddLinkOpen}
          onClose={() => setIsAddLinkOpen(false)}
          isLoading={state.state.isSaving}
          onAddLink={(link: ProfileLinkInput) => {
            // state.actions.addLink(link);
            console.log('addLink', link);
            _addLink(link).then(() => {
              setIsAddLinkOpen(false);
            });
          }}
        />

        <EditLinksModal
          // key={editLinkInfo.index} // @dev - this would break the animation
          isOpen={
            editLinkInfo.isOpen &&
            editLinkInfo.link !== undefined &&
            editLinkInfo.index !== undefined
          }
          onClose={() => setEditLinkInfo({ isOpen: false })}
          isLoading={state.state.isSaving}
          link={editLinkInfo.link}
          onRemoveLink={() => {
            if (editLinkInfo.index === undefined) {
              console.error('editLinkInfo.index is undefined');
              return;
            }
            _removeLink(publicProfileLinks[editLinkInfo.index!].id).then(() => {
              setEditLinkInfo({ isOpen: false });
            });
          }}
          onEditLink={(link: ProfileLinkInput) => {
            if (editLinkInfo.index === undefined) {
              console.error('editLinkInfo.index is undefined');
              return;
            }
            _editLink(publicProfileLinks[editLinkInfo.index!].id, link).then(
              () => {
                setEditLinkInfo({ isOpen: false });
              },
            );
          }}
        />
      </>
    </Box>
  );
};

export default LinksTab;
