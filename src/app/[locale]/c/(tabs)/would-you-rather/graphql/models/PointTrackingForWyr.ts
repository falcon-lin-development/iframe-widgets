import { GraphqlError } from '@/data/graphql/errors';
/**
 * {
  "data": {
    "getPointTrackingForWyr": {
      "__typename": "WyrUserPoint",
      "countUserVotedStreakDays": 3,
      "countUserVotedTotal": 31,
      "countVoteDailyLimit": 5,
      "flagUserVotedInToday": false,
      "lastUpdatedAt": 1716429849715,
      "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
      "countUserVotedDaily": 0
    }
  }
}
 */

export interface PointTrackingForWyr extends GraphqlError {
  __typename: string;
  countUserVotedStreakDays: number;
  countUserVotedTotal: number;
  countVoteDailyLimit: number;
  flagUserVotedInToday: boolean;
  lastUpdatedAt: number;
  personaId: string;
  countUserVotedDaily: number;
}

export const GET_POINT_TRACKING_FOR_WYR = /* GraphQL */ `
  query getPointTrackingForWyr($communityId: String!) {
    getPointTrackingForWyr(communityId: $communityId) {
      ... on WyrUserPoint {
        __typename
        countUserVotedStreakDays
        countUserVotedTotal
        countVoteDailyLimit
        flagUserVotedInToday
        lastUpdatedAt
        personaId
        countUserVotedDaily
      }
      ... on GraphqlError {
        __typename
        message
        error
        statusCode
      }
    }
  }
`;
