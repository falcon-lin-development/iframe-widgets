import { GraphqlError } from '../errors';

/**
 * @returns
    "getPersonaCommunityBadgeBalances": {
      "__typename": "CommunityBadgeBalanceList",
      "holding": [
        {
          "badgeMetadata": {
            "point_id": "badge#1770071e-0000-0000-0000-1770071e7000#attribute#mbti#entj",
            "cta": "{\"target\": \"iframe\", \"url\": \"https://www.mootiez.com/attribute-details/mbti/entj\"}",
            "thumbnail_url": "https://community-assets.dttd.io/mootiez/attributes/assets/MBTI/thumbnails/ENTJ.png",
            "img_url": "https://community-assets.dttd.io/mootiez/attributes/assets/MBTI/details/ENTJ.png",
            "display_name": "Chess Master",
            "free_claim": true,
            "community_id": "1770071e-0000-0000-0000-1770071e7000"
          },
          "balance": 1,
          "communityId": "1770071e-0000-0000-0000-1770071e7000",
          "personaId": "dc337266-5ee2-4b74-a439-4af37facb60a",
          "pointId": "badge#1770071e-0000-0000-0000-1770071e7000#attribute#mbti#entj"
        },
      ]
    },
 */

export type BadgeHolding = {
  badgeMetadata: {
    point_id: string;
    cta: string;
    thumbnail_url: string;
    img_url: string;
    display_name: string;
    free_claim: boolean;
    community_id: string;
  };
  balance: number;
  communityId: string;
  personaId: string;
  pointId: string;
};

export type GetPersonaCommunityBadgeBalancesResponse = {
  getPersonaCommunityBadgeBalances: {
    __typename: string;
    holding: BadgeHolding[];
  } & GraphqlError;
};
export const GET_USER_ATTRIBUTES_QUERY = `
    query GetUserAttributes {
      getPersonaCommunityBadgeBalances(
        badgeCategory: "attribute"
        communityId: "1770071e-0000-0000-0000-1770071e7000"
      ) {
        ... on CommunityBadgeBalanceList {
          __typename
          holding {
            badgeMetadata
            balance
            communityId
            personaId
            pointId
          }
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
