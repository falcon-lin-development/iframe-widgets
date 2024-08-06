'use client';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import { updateProfileData, UPDATE_PROFILE } from '../models/updateUserProfile';
import {
  updatePersonaUserHandle,
  UPDATE_PERSONA_USER_HANDLE,
} from '../models/updateUserHandle';
import { Community } from '@/data/services/fetchCommunityService';

export const useMutationUserProfile = (community: Community) => {
  const [result, updateProfile] =
    useMutation<updateProfileData>(UPDATE_PROFILE);
  const [resultUserHandle, updateUserHandle] = useMutation<{
    updatePersonaUserHandle: updatePersonaUserHandle;
  }>(UPDATE_PERSONA_USER_HANDLE);

  return {
    state: {
      updateProfileState: result,
      updateUserHandleState: resultUserHandle,
    },
    actions: {
      updateProfile: ({
        profileName = null,
        profileBio = null,
        profileAvatarUrl = null,
        dataStore = {},
        pageDesign = null,
        // pageIconUrl = null,
        pageSeoMetadata = null,
      }: {
        profileName?: string | null;
        profileBio?: string | null;
        profileAvatarUrl?: string | null;
        dataStore?: Record<string, any>;
        pageDesign?: Record<string, any> | null;
        // pageIconUrl?: string | null,
        pageSeoMetadata?: Record<string, any> | null;
      }) => {
        const promise = updateProfile({
          communityId: community.community_id,
          profileName,
          profileBio,
          profileAvatarUrl,
          dataStore: dataStore,
          pageDesign,
          pageIconUrl: null,
          pageSeoMetadata,
        });
        return promise;
      },
      updateUserHandle: ({ userHandle }: { userHandle: string }) => {
        const promise = updateUserHandle({
          communityId: community.community_id,
          userHandle,
        });
        return promise;
      },
    },
  };
};
