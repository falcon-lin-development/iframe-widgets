'use client';
import React from 'react';

// client
import { useQuery, UseMutationState, useMutation } from 'urql';

// model
import { ViewWyrPost, VIEW_WYR_POST_MUTATION } from '../models/viewWyrPost';
import { WyrPost } from '../models/WyrPost';

export const useViewWyrPost = (wyrPost: WyrPost) => {
  const [result, _viewWyrPost] = useMutation<{
    viewWyrPost: ViewWyrPost;
  }>(VIEW_WYR_POST_MUTATION);

  const viewWyrPostState: UseMutationState = result;

  const viewWyrPost = async (): Promise<void> => {
    try {
      const promise = _viewWyrPost({
        postId: wyrPost.postId,
      });
      promise.then((result) => {
        // console.log(
        //   'viewed:',
        //   wyrPost.postContent.caption,
        //   result.data?.viewWyrPost,
        // );
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    state: {
      viewWyrPostState,
    },
    actions: {
      viewWyrPost,
    },
  };
};
