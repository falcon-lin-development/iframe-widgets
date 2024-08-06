'use client';
import { Community } from '@/data/services/fetchCommunityService';
import { GraphqlError } from '@/data/graphql/errors';
import { useMutation } from 'urql';
import React, { useContext, createContext } from 'react';
import {
  CreateWyrPostResponse,
  WyrPostCreationReference,
  WyrPostInput,
  WyrPostContent,
  WyrDecorationType,
  PostCategory,
  CREATE_WYR_POST_MUTATION,
} from './models/createWyrPost';

export type {
  CreateWyrPostResponse,
  WyrPostCreationReference,
  WyrPostInput,
  WyrPostContent,
};
export { WyrDecorationType, PostCategory };

export interface CreateWyrPostParams {
  post: WyrPostInput;
  postCategory: PostCategory;
  sponsorId: string;
}

const _useCreateWyrPost = (community: Community) => {
  const [result, executeMutation] = useMutation<CreateWyrPostResponse>(
    CREATE_WYR_POST_MUTATION,
  );

  const createWyrPost = async ({
    post,
    postCategory,
    sponsorId,
  }: CreateWyrPostParams) => {
    try {
      const promise = executeMutation({
        communityId: community.community_id,
        post,
        postCategory,
        sponsorId,
      });
      promise
        .then((response) => {
          if (response.data) {
            response.data.createWyrPost.reference.post_content_map = JSON.parse(
              response.data.createWyrPost.reference.post_content,
            );
          }

          if (response.error) {
            console.error('GraphQL Error:', response.error);
          } else {
            console.log(
              'Post created successfully:',
              response.data?.createWyrPost,
            );
          }
        })
        .catch((e) => {
          console.error('catached error', e);
        })
        .finally(() => {
          console.log('Mutation completed');
        });

      return promise;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    createWyrPostState: {
      ...result,
    },
    createWyrPost: createWyrPost,
  };
};

// ContextAPI default stuffs
const CreateWyrPostContext = createContext<ReturnType<
  typeof _useCreateWyrPost
> | null>(null);
export const useCreateWyrPost = () => {
  const context = useContext(CreateWyrPostContext);
  if (!context) {
    throw new Error(
      'useCreateWyrPost must be used within a CreateWyrPostProvider',
    );
  }
  return context;
};

export const CreateWyrPostProvider: React.FC<{
  children: React.ReactNode;
  community: Community;
}> = ({ children, community }) => {
  const _ = _useCreateWyrPost(community);
  return (
    <CreateWyrPostContext.Provider value={_}>
      {children}
    </CreateWyrPostContext.Provider>
  );
};
