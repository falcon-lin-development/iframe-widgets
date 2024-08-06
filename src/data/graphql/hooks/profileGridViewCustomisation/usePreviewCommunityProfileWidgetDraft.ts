'use client';
// query
import { useMutation, useQuery } from 'urql';

import {
  PreviewCommunityProfileWidgetDraftQueryResponse,
  PREVIEW_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY,
} from '@/data/graphql/models/profileGridViewCustomisation/previewCommunityProfileWidgetDraft';
import { useMainClient } from '@/app/providers/GraphQLProvider';

import { useMemo } from 'react';

export const usePreviewCommunityProfileWidgetDraft = () => {
  const { client } = useMainClient();
  const [
    previewCommunityProfileWidgetDraft,
    getPreviewCommunityProfileWidgetDraft,
  ] = useQuery<PreviewCommunityProfileWidgetDraftQueryResponse>({
    query: PREVIEW_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY,
  });

  const init = useMemo(() => {
    return Boolean(
      previewCommunityProfileWidgetDraft.data
        ?.previewCommunityProfileWidgetDraft,
    );
  }, [previewCommunityProfileWidgetDraft]);

  return {
    previewCommunityProfileWidgetDraft: {
      state: {
        previewCommunityProfileWidgetDraftState:
          previewCommunityProfileWidgetDraft,
        previewCommunityProfileWidgetDraft:
          previewCommunityProfileWidgetDraft.data
            ?.previewCommunityProfileWidgetDraft,
        previewCommunityProfileWidgetDraftInit: init,
      },
      actions: {
        // previewCommunityProfileWidgetDraft: async () => {
        //     const profileDraftLayout = await client.query(PREVIEW_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY, {});
        //     return profileDraftLayout;
        // },
        refreshPreviewCommunityProfileWidgetDraft: () => {
          getPreviewCommunityProfileWidgetDraft();
        },
      },
    },
  };
};
