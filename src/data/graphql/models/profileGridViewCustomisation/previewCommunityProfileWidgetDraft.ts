// {
//     "data": {
//       "previewCommunityProfileWidgetDraft": {
//         "__typename": "CommunityProfileWidgetData",
//         "data": {
//           "widget": [
//             {
//               "type": "user-name-widget",
//               "layout": {
//                 "x": 0,
//                 "h": 1,
//                 "y": 3,
//                 "z": 2,
//                 "w": 4
//               },
//               "attributes": {}
//             }
//           ],
//           "page_config": {}
//         },
//         "errors": {},
//         "pageId": "default"
//       }
//     }
//   }

import { GraphqlError } from '../../errors';

export type PreviewCommunityProfileWidgetDraftQueryResponse = {
  previewCommunityProfileWidgetDraft: {
    __typename: string;
    data: {
      widget: any;
      page_config: any;
    };
    errors: any;
    pageId: string;
  } & GraphqlError;
};

export const PREVIEW_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY = `
query MyQ2{
    previewCommunityProfileWidgetDraft(communityId: "1770071e-0000-0000-0000-1770071e7000") {
    ... on CommunityProfileWidgetData {
      __typename
      data
      errors
      pageId
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
