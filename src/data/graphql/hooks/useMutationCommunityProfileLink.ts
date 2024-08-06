'use client';
// client
import { useMutation, useQuery } from 'urql';

// models / quert

import {
  createCommunityProfileLink,
  CREATE_COMMUNITY_PROFILE_LINK,
} from '../models/CommunityProfileLink/createCommunityProfileLink';
import {
  updateCommunityProfileLink,
  UPDATE_COMMUNITY_PROFILE_LINK,
} from '../models/CommunityProfileLink/updateCommunityProfileLink';
import {
  removeCommunityProfileLink,
  REMOVE_COMMUNITY_PROFILE_LINK,
} from '../models/CommunityProfileLink/removeCommunityProfileLink';
import { Community } from '@/data/services/fetchCommunityService';

export const useMutationCommunityProfileLink = (community: Community) => {
  const [resultCreate, createProfileLink] = useMutation<{
    createCommunityProfileLink: createCommunityProfileLink;
  }>(CREATE_COMMUNITY_PROFILE_LINK);
  const [resultUpdate, updateProfileLink] = useMutation<{
    updateCommunityProfileLink: updateCommunityProfileLink;
  }>(UPDATE_COMMUNITY_PROFILE_LINK);
  const [resultRemove, removeProfileLink] = useMutation<{
    removeCommunityProfileLink: removeCommunityProfileLink;
  }>(REMOVE_COMMUNITY_PROFILE_LINK);

  return {
    state: {
      createProfileLinkState: resultCreate,
      updateProfileLinkState: resultUpdate,
      removeProfileLinkState: resultRemove,
    },
    actions: {
      createProfileLink: ({
        title,
        // icon,
        url,
      }: {
        title: string;
        // icon: string,
        url: string;
      }) => {
        const promise = createProfileLink({
          communityId: community.community_id,
          title: title,
          url: url,
          icon: '',
        });
        return promise;
      },
      updateProfileLink: ({
        linkId,
        title,
        // icon,
        url,
      }: {
        linkId: string;
        title: string;
        // icon: string,
        url: string;
      }) => {
        const promise = updateProfileLink({
          communityId: community.community_id,
          linkId: linkId,
          title: title,
          url: url,
          icon: '',
        });
        return promise;
      },
      removeProfileLink: ({ linkId }: { linkId: string }) => {
        const promise = removeProfileLink({
          communityId: community.community_id,
          linkId: linkId,
        });
        return promise;
      },
    },
  };
};
