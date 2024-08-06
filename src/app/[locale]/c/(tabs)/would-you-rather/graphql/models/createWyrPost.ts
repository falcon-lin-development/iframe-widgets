import { GraphqlError } from '@/data/graphql/errors';
import {
  // Option,
  WyrPostContent,
  PostCategory,
  WyrDecorationType,
} from './WyrPost';

type WyrPostInput = WyrPostContent;

interface WyrPostCreationReference {
  community_id: string;
  persona_id: string;
  seed: string;
  post_type: string;
  post_content: string;
  post_content_map?: WyrPostContent;
  post_category: PostCategory;
  is_enabled: boolean;
  is_time_sensitive: boolean;
  start_timestamp: number;
  expiry_timestamp: number;
  tags: string[];
  sponsor_id: string;
  sponsor_info: string;
  mark_deleted: boolean;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
  reported_to_hide: boolean;
  reported_reason: string;
  post_id: string;
}

interface _createWyrPost extends GraphqlError {
  __typename: string;
  message: string;
  status: string;
  reference: WyrPostCreationReference;
}

interface CreateWyrPostResponse {
  createWyrPost: _createWyrPost;
}

export { PostCategory, WyrDecorationType };

export type {
  CreateWyrPostResponse,
  WyrPostCreationReference,
  WyrPostInput,
  WyrPostContent,
  // Option,
};

export const CREATE_WYR_POST_MUTATION = `
  mutation CreateWyrPost(
    $communityId: String!,
    $post: JSON!,
    $postCategory: String!,
    $sponsorId: String!
  ) {
    createWyrPost(
      communityId: $communityId,
      post: $post,
      postCategory: $postCategory,
      sponsorId: $sponsorId
    ) {
      ... on WyrPostResponse {
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
