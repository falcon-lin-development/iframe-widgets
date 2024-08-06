import { GraphqlError } from '@/data/graphql/errors';

export interface Option {
  option_id: string;
  option_text: string;
  transform?: string;
  img_url?: string;
  img_transform?: string;
  [key: string]: any; // Allows for additional properties
}

enum PostCategory {
  ugc = 'ugc',
  sponsored = 'sponsored',
  popular = 'popular',
  normal = 'normal',
}

enum WyrDecorationType {
  gradient = 'gradient',
  background = 'background',
}

enum ResponseType {
  skip = 'skip',
  vote = 'vote',
}
interface WyrPostContent {
  caption: string;
  options: Option[];
  decoration?: {
    type: WyrDecorationType;
    gradient?: string;
    background?: string;
  };
  [key: string]: any; // Allows for additional properties
}

interface WyrPost extends GraphqlError {
  __typename: string;
  communityId: string;
  expiryTimestamp: number;
  isEnabled: boolean;
  isTimeSensitive: boolean;
  postCategory: PostCategory;
  postContent: WyrPostContent;
  postId: string;
  postType: string;
  sortId: string;
  sponsorId: string;
  sponsorInfo: Record<string, any>;
  startTimestamp: number;
  status: string;
  tags: string[];
  userDetails: {
    response_id?: string;
    response_timestamp?: number;
    response_type?: ResponseType;
    response_option_id?: string;
    response_option_text?: string;
    response_extra_content?: Record<string, any>;
    skip_reason?: string;
    response_stats?: {
      total_count: number;
      skip_count: number;
      option_count: Record<string, number>; // { option_id: count
    };
  };
  viewStats: {
    like_count: number;
    comment_count: number;
    view_count: number;
  };
  createdAt: number;
  userInteraction?: {
    is_viewed?: boolean;
    is_liked?: boolean;
    is_bookmarked?: boolean;
    is_commented?: boolean;
  };
}

function isRecord(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object';
}

export function isWyrPost(obj: any): { isValid: boolean; error?: string } {
  if (!isRecord(obj))
    return { isValid: false, error: 'Object must be a record' };
  if (typeof obj.__typename !== 'string')
    return { isValid: false, error: 'Invalid or missing __typename' };
  if (typeof obj.communityId !== 'string')
    return { isValid: false, error: 'Invalid or missing communityId' };
  if (typeof obj.expiryTimestamp !== 'number')
    return { isValid: false, error: 'Invalid or missing expiryTimestamp' };
  if (typeof obj.isEnabled !== 'boolean')
    return { isValid: false, error: 'Invalid or missing isEnabled' };
  if (typeof obj.isTimeSensitive !== 'boolean')
    return { isValid: false, error: 'Invalid or missing isTimeSensitive' };
  if (typeof obj.postCategory !== 'string')
    return { isValid: false, error: 'Invalid or missing postCategory' };
  if (!isRecord(obj.postContent))
    return { isValid: false, error: 'Invalid or missing postContent' }; // Extend with further checks as necessary
  if (
    !Array.isArray(obj.postContent.options) ||
    !obj.postContent.options.every((option) => isRecord(option))
  )
    return {
      isValid: false,
      error: 'Invalid or missing options in postContent',
    };
  if (!(obj.postContent.options.length >= 2))
    return {
      isValid: false,
      error: 'Invalid or missing options in postContent',
    };
  if (typeof obj.postId !== 'string')
    return { isValid: false, error: 'Invalid or missing postId' };
  if (typeof obj.postType !== 'string')
    return { isValid: false, error: 'Invalid or missing postType' };
  if (typeof obj.sortId !== 'string')
    return { isValid: false, error: 'Invalid or missing sortId' };
  if (typeof obj.sponsorId !== 'string')
    return { isValid: false, error: 'Invalid or missing sponsorId' };
  if (!isRecord(obj.sponsorInfo))
    return { isValid: false, error: 'Invalid or missing sponsorInfo' };
  if (typeof obj.startTimestamp !== 'number')
    return { isValid: false, error: 'Invalid or missing startTimestamp' };
  if (typeof obj.status !== 'string')
    return { isValid: false, error: 'Invalid or missing status' };
  // if (!Array.isArray(obj.tags) || !obj.tags.every(tag => typeof tag === 'string')) return { isValid: false, error: 'Invalid or missing tags' };
  if (!isRecord(obj.userDetails))
    return { isValid: false, error: 'Invalid or missing userDetails' }; // Extend with further checks as necessary
  // if (!isRecord(obj.viewStats)) return { isValid: false, error: 'Invalid or missing viewStats' };
  // if (typeof obj.viewStats.like_count !== 'number') return { isValid: false, error: 'Invalid or missing like_count in viewStats' };
  // if (typeof obj.viewStats.comment_count !== 'number') return { isValid: false, error: 'Invalid or missing comment_count in viewStats' };
  // if (typeof obj.viewStats.view_count !== 'number') return { isValid: false, error: 'Invalid or missing view_count in viewStats' };

  return { isValid: true };
}

export const GET_WYR_POSTS_QUERY = `
    query getWyrPost(
        $postId: String!
    ) {
        getWyrPost(postId: $postId) {
            ... on WyrPost {
                __typename
                communityId
                expiryTimestamp
                isEnabled
                isTimeSensitive
                postCategory
                postContent
                postId
                postType
                sortId
                sponsorId
                sponsorInfo
                startTimestamp
                status
                tags
                userDetails
                viewStats
                createdAt
                userInteraction
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

export { WyrDecorationType, PostCategory, ResponseType };
export type {
  // Option,
  WyrPostContent,
  WyrPost,
};
