import { GraphqlError } from '../errors';

export enum AttributeType {
  mbti = 'mbti',
  pronoun = 'pronoun',
}

export type DropAttributesMutationResponse = {
  giveawayCommunityBadge:
    | GraphqlError
    | {
        __typename: string;
        message: string;
        reference: {
          transaction_id: string;
        };
        status: string;
      };
};

export const DROP_ATTRIBUTES_MUTATION = `
  mutation MyMutation(
      $categoryType: String!
      $categoryValue: String!
  ) {
    giveawayCommunityBadge(
      badgeCategory: "attribute"
      categoryType: $categoryType
      categoryValue: $categoryValue
      communityId: "1770071e-0000-0000-0000-1770071e7000"
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
        statusCode
        message
      }
    }
  }  
  `;
