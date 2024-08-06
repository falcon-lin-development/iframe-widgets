'use client';
import { useEffect, useMemo, useState } from 'react';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';

import { useMutationUserProfile } from '@/data/graphql/hooks/useMutationUserProfile';
import {
  uploadCommunityImageFile,
  CommunityImageFileFolder,
} from '@/data/repositaries/CommunityImageFileRepo';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useCommunityProfilePagePublic } from '@/data/graphql/hooks/useCommunityProfilePagePublic';
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';

// model
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import { Community } from '@/data/services/fetchCommunityService';
import { useMutationCommunityProfileLink } from '@/data/graphql/hooks/useMutationCommunityProfileLink';

/**
 * useEditProfilePageState
 * @returns
 */
export const useEditProfilePageState = () => {
  const { community } = useCommunity();
  const { communityProfile, isProfileInit, refreshProfile } =
    useCommunityProfile(community);

  const {
    state: { communityProfilePagePublicInit, communityProfilePagePublic },
    actions: { refreshCommunityProfilePagePublic },
  } = useCommunityProfilePagePublic({
    communityId: community.community_id,
    personaId: communityProfile.persona.persona_id,
    // communityId: "1770071e-0000-0000-0000-1770071e7000",
    // personaId: "dc337266-5ee2-4b74-a439-4af37facb60a"
  });
  const {
    state: { userAttributesInit, userAttributes },
  } = usePersonaAttributeBadges();

  /**
   * Editable profile and page public
   */
  const [editedProfile, setEditedProfile] = useState<PersonaCommunityProfile>(
    {} as PersonaCommunityProfile,
  );
  const [editedPagePublic, setEditedPagePublic] =
    useState<CommunityProfilePagePublic>({} as CommunityProfilePagePublic);
  const {
    state: {
      createProfileLinkState,
      updateProfileLinkState,
      removeProfileLinkState,
    },
    actions: { createProfileLink, updateProfileLink, removeProfileLink },
  } = useMutationCommunityProfileLink(community);
  /**
   * Functions to update profile and page public
   */
  const _refreshAll = async () => {
    // @dev this refresh not very work since
    // we cannot await refreshCommunityProfilePagePublic
    const promises = [refreshProfile(), refreshCommunityProfilePagePublic()];
    const results = await Promise.all(promises);
    // @dev this is not working, so this will rely on the UI update.
    // setEditedProfile({} as PersonaCommunityProfile);
    // setEditedPagePublic({} as CommunityProfilePagePublic);
    // return results;
  };

  const {
    savedSnackbarOpen,
    openPreview,
    errorMessage,
    isSavingProfile,
    isErrorDialogOpen,
    _saveProfile,
    updateProfile,
    closeErrorDialog,
    setOpenPreview,
    setSavedSnackbarOpen,
  } = useSaveProfile({
    editedProfile,
    editedPagePublic,
    community,
    communityProfile,
    refreshAll: _refreshAll,
  });

  // states
  const isEditProfilePageInit = useMemo(() => {
    return (
      isProfileInit &&
      communityProfilePagePublicInit &&
      userAttributesInit &&
      editedPagePublic.communityId &&
      editedProfile.community_id
    );
  }, [
    isProfileInit,
    communityProfilePagePublicInit,
    userAttributesInit,
    editedPagePublic,
    editedProfile,
  ]);

  const isLoading = useMemo(() => {
    return (
      isSavingProfile ||
      createProfileLinkState.fetching ||
      updateProfileLinkState.fetching ||
      removeProfileLinkState.fetching
    );
  }, [
    isSavingProfile,
    createProfileLinkState,
    updateProfileLinkState,
    removeProfileLinkState,
  ]);

  /**
   * sync community profile and page public
   */
  useEffect(() => {
    if (communityProfilePagePublic?.pageId && !editedPagePublic.pageId) {
      setEditedPagePublic(Object.assign({}, communityProfilePagePublic));
    }
  }, [communityProfilePagePublic, editedPagePublic]);

  useEffect(() => {
    if (
      communityProfile?.persona?.persona_id &&
      editedProfile &&
      !editedProfile?.persona?.persona_id
    ) {
      setEditedProfile(Object.assign({}, communityProfile));
    }
  }, [communityProfile, editedProfile]);

  // useEffect(() => {
  //   console.log(
  //     'communityProfile',
  //     communityProfile.profile_avatar_url,
  //     'editedProfile',
  //     editedProfile.profile_avatar_url,
  //     'communityProfilePagePublic',
  //     communityProfilePagePublic?.persona?.profileAvatarUrl,
  //     'editedPagePublic',
  //     editedPagePublic?.persona?.profileAvatarUrl,
  //   );
  // }, [
  //   communityProfile,
  //   editedProfile,
  //   editedPagePublic,
  //   communityProfilePagePublic,
  // ]);

  return {
    state: {
      // models
      community,
      communityProfile,
      communityProfilePagePublic,
      userAttributes,
      // edited models
      editedProfile,
      editedPagePublic,
      // states
      isEditProfilePageInit,
      isSaving: isLoading,
      openPreview,
      savedSnackbarOpen,
      isErrorDialogOpen,
      // other data
      errorMessage,
    },
    actions: {
      // set edited models
      setEditedProfile,
      setEditedPagePublic,

      // set dialogs
      setOpenPreview,
      setSavedSnackbarOpen,
      closeErrorDialog,

      // action
      saveProfile: _saveProfile,
      updateProfile,
      createProfileLink,
      updateProfileLink,
      removeProfileLink,
      refreshAll: _refreshAll,
    },
  };
};

/**
 * useSaveProfile
 */
const useSaveProfile = ({
  editedProfile,
  editedPagePublic,
  community,
  communityProfile,
  refreshAll,
}: {
  editedProfile: PersonaCommunityProfile;
  editedPagePublic: CommunityProfilePagePublic;
  community: Community;
  communityProfile: PersonaCommunityProfile;
  refreshAll: () => Promise<void>;
}) => {
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const {
    state: { updateProfileState, updateUserHandleState },
    actions: { updateProfile, updateUserHandle },
  } = useMutationUserProfile(community);
  // dialogs
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSnackbarOpen, setSavedSnackbarOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const _updateUserHandle = async () => {
    const userHandleResult = await updateUserHandle({
      userHandle: editedProfile.persona.user_handle,
    });
    const result =
      userHandleResult.data?.updatePersonaUserHandle?.status === 'ok';
    if (!result) {
      setErrorMessage(
        userHandleResult.data?.updatePersonaUserHandle.message ||
          'Failed to update user handle',
      );
      console.error(userHandleResult.data?.updatePersonaUserHandle.message);
    }
    console.log('userHandleResult', userHandleResult);
    return result;
  };

  const _uploadAvatar = async () => {
    // upload avatar
    const accessToken = (await getBearerToken()).jwtToken;
    const avatarResult = await uploadCommunityImageFile({
      accessToken: accessToken,
      communityId: community.community_id,
      folder: CommunityImageFileFolder.avatar,
      // recreate a file from url
      file: new File(
        [await fetch(editedProfile.profile_avatar_url).then((r) => r.blob())],
        'avatar.jpg',
      ),
    });
    if (avatarResult.url) {
      editedProfile.profile_avatar_url = avatarResult.url;
    } else {
      setErrorMessage('Failed to upload avatar');
      console.error('Failed to upload avatar');
      return;
    }
    return avatarResult.url;
  };

  const _saveEditProfile = async () => {
    let result = true;
    setIsSavingProfile(true);
    try {
      // 1) update user handle if changed
      if (
        editedProfile.persona?.user_handle !==
        communityProfile.persona?.user_handle
      ) {
        result = result && (await _updateUserHandle());
        if (!result) {
          return;
        }
      }

      // 2) upload avatar if changed
      const mootiezVeryFirstImage = editedProfile.data_store?.mbti_avatar;
      if (
        editedProfile.profile_avatar_url !==
          communityProfile.profile_avatar_url &&
        editedProfile.profile_avatar_url !== mootiezVeryFirstImage // @dev if equal than use original image
      ) {
        const avatarUrl = await _uploadAvatar();
        if (!avatarUrl) {
          return;
        }
      }

      // 3) update profile
      const _pageDesign = {
        // @dev pageDesign overwrites the whole JSON object
        ...editedPagePublic.design,
        css: {
          ...editedPagePublic.design?.css,
          background: editedPagePublic.design?.css?.background,
        },
        // links: editedProfile.links, // link logic is done in the link tab
        attributes: editedPagePublic.design?.attributes,
      };
      const _isAvatarChanged =
        editedProfile.profile_avatar_url !==
        communityProfile.profile_avatar_url;
      const _hasStoredMBTIAvatar = Boolean(
        communityProfile.data_store?.mbti_avatar,
      );
      const profileResult = await updateProfile({
        profileName: editedProfile.profile_name,
        profileBio: editedProfile.profile_bio,
        // @dev if avatar changed, use the new one, else undefined
        profileAvatarUrl: _isAvatarChanged
          ? editedProfile.profile_avatar_url
          : undefined,
        // @dev keep the old avatar if not exist
        dataStore: {
          // @dev data store only changes base on specific key
          mbti_avatar: _hasStoredMBTIAvatar
            ? undefined
            : editedProfile.profile_avatar_url,
        },
        // @dev pageDesign // store background and links
        pageDesign: _pageDesign,
        // pageSeoMetadata // hard code a few things
      });
      result =
        result &&
        profileResult.data?.updateCommunityProfilePagePublic.status === 'ok' &&
        profileResult.data?.updateProfileDatastore.status === 'ok' &&
        profileResult.data?.updatePersonaProfileInfo.status === 'ok';

      if (result) {
        await refreshAll();
        setSavedSnackbarOpen(true);
      } else {
        console.error(
          profileResult.data?.updateCommunityProfilePagePublic.message,
          profileResult.data?.updateProfileDatastore.message,
          profileResult.data?.updatePersonaProfileInfo.message,
        );
        setErrorMessage('Failed to update profile');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage(`Some error occurred: ${(e as Error).message}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const _isSavingProfile = useMemo(() => {
    return (
      updateProfileState.fetching ||
      updateUserHandleState.fetching ||
      isSavingProfile
    );
  }, [
    updateProfileState.fetching,
    updateUserHandleState.fetching,
    isSavingProfile,
  ]);

  return {
    savedSnackbarOpen,
    isSavingProfile: _isSavingProfile,
    openPreview,
    errorMessage,
    isErrorDialogOpen: Boolean(errorMessage),
    _saveProfile: _saveEditProfile,
    updateProfile, // direct call for update profile GraphQL API
    closeErrorDialog: () => setErrorMessage(''),
    setOpenPreview,
    setSavedSnackbarOpen,
  };
};
