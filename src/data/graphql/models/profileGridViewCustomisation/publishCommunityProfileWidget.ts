import { GraphqlError } from '../../errors';

export type PublishCommunityProfileWidgetMutationResponse = {
  publishCommunityProfileWidget: {
    __typename: string;
    message: string;
    reference: string;
    status: string;
  } & GraphqlError;
};

export const PUBLISH_COMMUNITY_PROFILE_WIDGET_MUTATION = `
mutation publish {
  publishCommunityProfileWidget(communityId: "1770071e-0000-0000-0000-1770071e7000") {
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
}`;
