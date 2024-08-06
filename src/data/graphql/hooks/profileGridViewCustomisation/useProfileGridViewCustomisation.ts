'use client';
// query
import { useMutation, useQuery } from 'urql';

import {
  GetCommunityProfileWidgetDraftQueryResponse,
  GET_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY,
} from '@/data/graphql/models/profileGridViewCustomisation/CommunityProfileWidgetDraft';
import {
  UpdateCommunityProfileWidgetDraftMutationResponse,
  UPDATE_COMMUNITY_PROFILE_WIDGET_DRAFT_MUTATION,
} from '@/data/graphql/models/profileGridViewCustomisation/updateCommunityProfileWidgetDraft';
import {
  RevertCommunityProfileWidgetDraftMutationResponse,
  REVERT_COMMUNITY_PROFILE_WIDGET_DRAFT_MUTATION,
} from '@/data/graphql/models/profileGridViewCustomisation/revertCommunityProfileWidgetDraft';
import {
  PublishCommunityProfileWidgetMutationResponse,
  PUBLISH_COMMUNITY_PROFILE_WIDGET_MUTATION,
} from '@/data/graphql/models/profileGridViewCustomisation/publishCommunityProfileWidget';

import { useMemo } from 'react';
import { BaseProfileWidgetType } from '@/app/[locale]/c/(tabs)/profile/profile-page-customization/widgets/ProfileWidgetTypes';

export const useProfileGridViewCustomisation = () => {
  const [result, getCommunityProfileWidgetDraft] =
    useQuery<GetCommunityProfileWidgetDraftQueryResponse>({
      query: GET_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY,
    });

  const [
    updateCommunityProfileWidgetDraftResult,
    updateCommunityProfileWidgetDraft,
  ] = useMutation<UpdateCommunityProfileWidgetDraftMutationResponse>(
    UPDATE_COMMUNITY_PROFILE_WIDGET_DRAFT_MUTATION,
  );
  const [
    revertCommunityProfileWidgetDraftResult,
    revertCommunityProfileWidgetDraft,
  ] = useMutation<RevertCommunityProfileWidgetDraftMutationResponse>(
    REVERT_COMMUNITY_PROFILE_WIDGET_DRAFT_MUTATION,
  );
  const [publishCommunityProfileWidgetResult, publishCommunityProfileWidget] =
    useMutation<PublishCommunityProfileWidgetMutationResponse>(
      PUBLISH_COMMUNITY_PROFILE_WIDGET_MUTATION,
    );

  const init = useMemo(() => {
    return Boolean(result.data?.getCommunityProfileWidgetDraft);
  }, [result]);

  return {
    communityProfileWidgetDraft: {
      state: {
        communityProfileWidgetDraftState: result,
        communityProfileWidgetDraft:
          result.data?.getCommunityProfileWidgetDraft,
        communityProfileWidgetDraftInit: init,
      },
      actions: {
        refreshCommunityProfileWidgetDraft: () => {
          getCommunityProfileWidgetDraft();
        },
      },
    },
    updateCommunityProfileWidgetDraft: {
      state: {
        updateCommunityProfileWidgetDraftState:
          updateCommunityProfileWidgetDraftResult,
        // updateCommunityProfileWidgetDraft:
        //   updateCommunityProfileWidgetDraftResult.data
        //     ?.updateCommunityProfileWidgetDraft,
      },
      actions: {
        updateCommunityProfileWidgetDraft: ({
          widgets,
          pageConfig,
        }: {
          widgets: Record<string, BaseProfileWidgetType>;
          pageConfig: Record<string, any>;
        }) => {
          const promise = updateCommunityProfileWidgetDraft({
            widgets,
            pageConfig,
          });
          return promise;
        },
      },
    },
    revertCommunityProfileWidgetDraft: {
      state: {
        revertCommunityProfileWidgetDraftState:
          revertCommunityProfileWidgetDraftResult,
        revertCommunityProfileWidgetDraft:
          revertCommunityProfileWidgetDraftResult.data
            ?.revertCommunityProfileWidgetDraft,
      },
      actions: {
        revertCommunityProfileWidgetDraft,
      },
    },
    publishCommunityProfileWidget: {
      state: {
        publishCommunityProfileWidgetState: publishCommunityProfileWidgetResult,
        // publishCommunityProfileWidget:
        //   publishCommunityProfileWidgetResult.data
        //     ?.publishCommunityProfileWidget,
      },
      actions: {
        publishCommunityProfileWidget,
      },
    },
  };
};
