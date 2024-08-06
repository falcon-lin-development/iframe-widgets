// {
//     "data": {
//       "getCommunityProfileWidgetDraft": {
//         "__typename": "CommunityProfileWidgetData",
//         "data": {
//           "widget": {},
//           "page_config": {}
//         },
//         "errors": {},
//         "pageId": "default"
//       }
//     }
//   }
import { GraphqlError } from '../../errors';

export type GetCommunityProfileWidgetDraftQueryResponse = {
  getCommunityProfileWidgetDraft: {
    __typename: string;
    data: {
      widget: Record<string, any>;
      page_config: {
        css?: {
          background?: string;
          [key: string]: any;
        };
      };
    };
    errors: any;
    pageId: string;
  } & GraphqlError;
};

export const GET_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY = `
query GET_COMMUNITY_PROFILE_WIDGET_DRAFT_QUERY{
  getCommunityProfileWidgetDraft(communityId: "1770071e-0000-0000-0000-1770071e7000") {
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
