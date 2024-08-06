'use client';
// query
import { useMutation, useQuery } from 'urql';

import {
  InitCommunityProfilePageMutationResponse,
  INIT_COMMUNITY_PROFILE_PAGE_MUTATION,
} from '@/data/graphql/models/profileGridViewCustomisation/initCommunityProfilePage';
import { useProfileGridViewCustomisation } from './useProfileGridViewCustomisation';
import { useEffect, useMemo } from 'react';
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';
import {
  ItemLayoutZIndex,
  ProfileWidgetTypes,
} from '@/app/[locale]/c/(tabs)/profile/profile-page-customization/widgets/ProfileWidgetTypes';

export const useInitCommunityProfilePage = () => {
  const [initCommunityProfilePageState, initCommunityProfilePage] =
    useMutation<InitCommunityProfilePageMutationResponse>(
      INIT_COMMUNITY_PROFILE_PAGE_MUTATION,
    );
  const {
    updateCommunityProfileWidgetDraft: {
      state: { updateCommunityProfileWidgetDraftState },
      actions: { updateCommunityProfileWidgetDraft },
    },
    publishCommunityProfileWidget: {
      state: { publishCommunityProfileWidgetState },
      actions: { publishCommunityProfileWidget },
    },
  } = useProfileGridViewCustomisation();

  const init = useMemo(() => {
    return Boolean(
      initCommunityProfilePageState.data?.initCommunityProfilePage,
    );
  }, [initCommunityProfilePageState]);

  const isPageInit = useMemo(() => {
    return (
      init &&
      initCommunityProfilePageState.data?.initCommunityProfilePage.reference
        .page_published === true
    );
  }, [initCommunityProfilePageState]);

  // init page first publish
  const initPublishCommunityProfilePage = () => {
    if (init && !isPageInit) {
      // save draft
      updateCommunityProfileWidgetDraft({
        widgets: DEFAULT_PROFILE_WIDGETS,
        pageConfig: {
          css: {
            background: ProfileBGOptions[0].background,
          },
        },
      }).then((res) => {
        if (res.data?.updateCommunityProfileWidgetDraft.status === 'ok') {
          // publish
          publishCommunityProfileWidget().then((res) => {
            if (res.data?.publishCommunityProfileWidget.status === 'ok') {
              // refresh
              initCommunityProfilePage();
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    initCommunityProfilePage();
  }, []);

  useEffect(() => {
    if (init && !isPageInit) {
      initPublishCommunityProfilePage();
    }
  }, [init, isPageInit]);

  // useEffect(() => {
  //   console.log({
  //     message: 'states',
  //     initCommunityProfilePageState,
  //     updateCommunityProfileWidgetDraftState,
  //     publishCommunityProfileWidgetState,
  //   });
  // }, [
  //   initCommunityProfilePageState,
  //   updateCommunityProfileWidgetDraftState,
  //   publishCommunityProfileWidgetState,
  // ]);

  return {
    state: {
      initCommunityProfilePageState,
      isCommunityProfilePageInit: init,
    },
    // actions: {},
  };
};

const DEFAULT_PROFILE_WIDGETS = {
  [ProfileWidgetTypes.MootiezBrandingWidget]: {
    id: ProfileWidgetTypes.MootiezBrandingWidget,
    type: ProfileWidgetTypes.MootiezBrandingWidget,
    layout: {
      x: 1,
      y: 10,
      w: 4,
      h: 1,
      z: ItemLayoutZIndex.static,
    },
  },
  [ProfileWidgetTypes.AvatarWidget]: {
    id: ProfileWidgetTypes.AvatarWidget,
    type: ProfileWidgetTypes.AvatarWidget,
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 6,
      z: ItemLayoutZIndex.content,
    },
  },
  [ProfileWidgetTypes.UserNameWidget]: {
    id: ProfileWidgetTypes.UserNameWidget,
    type: ProfileWidgetTypes.UserNameWidget,
    layout: {
      x: 1,
      y: 6,
      w: 4,
      h: 1,
      z: ItemLayoutZIndex.content,
    },
  },
  [ProfileWidgetTypes.BioWidget]: {
    id: ProfileWidgetTypes.BioWidget,
    type: ProfileWidgetTypes.BioWidget,
    layout: {
      x: 0,
      y: 7,
      w: 6,
      h: 1,
      z: ItemLayoutZIndex.content,
    },
  },
};
