// {
//     "data": {
//       "updateCommunityProfileWidgetDraft": {
//         "__typename": "SimpleMutationResponse",
//         "message": "User draft of profile widgets updated successfully",
//         "reference": {
//           "persona": {
//             "persona_id": "",
//             "user_handle": "",
//             "profile_name": "",
//             "profile_avatar_url": "",
//             "profile_bio": "",
//             "own_referral_code": ""
//           },
//           "community_id": "",
//           "page_id": "",
//           "page_name": "",
//           "page_icon_url": "",
//           "seo_metadata": {},
//           "is_private": false,
//           "design": {},
//           "layout": {},
//           "page_config": {},
//           "generated_url": "",
//           "page_type": "",
//           "created_at": 0,
//           "updated_at": 0
//         },
//         "status": "ok"
//       }
//     }
//   }

import { GraphqlError } from '../../errors';

export type UpdateCommunityProfileWidgetDraftMutationResponse = {
  updateCommunityProfileWidgetDraft: {
    __typename: string;
    message: string;
    reference: {
      // persona: {
      //     persona_id: string;
      //     user_handle: string;
      //     profile_name: string;
      //     profile_avatar_url: string;
      //     profile_bio: string;
      //     own_referral_code: string;
      // };
      // community_id: string;
      // page_id: string;
      // page_name: string;
      // page_icon_url: string;
      // seo_metadata: any;
      // is_private: boolean;
      // design: any;
      // layout: any;
      // page_config: any;
      // generated_url: string;
      // page_type: string;
      // created_at: number;
      // updated_at: number;
    };
    status: string;
  } & GraphqlError;
};

export const UPDATE_COMMUNITY_PROFILE_WIDGET_DRAFT_MUTATION = `
mutation updateCommunityProfileWidgetDraft($pageConfig: JSON, $widgets: JSON) {
  updateCommunityProfileWidgetDraft(
    communityId: "1770071e-0000-0000-0000-1770071e7000"
    pageConfig: $pageConfig
    widgets: $widgets
  ) {
    ... on SimpleMutationResponse {
      __typename
      message
      reference
      status
    }
    ... on GraphqlError {
      __typename
      error
      message
      statusCode
    }
  }
}
`;
