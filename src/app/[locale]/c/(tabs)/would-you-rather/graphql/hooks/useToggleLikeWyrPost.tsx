'use client';
import React, { useState, useMemo } from 'react';

// client
import { CombinedError, UseMutationState, useMutation, useQuery } from 'urql';

// models
import {
  TOGGLE_LIKE_WYR_POST_MUTATION,
  ToggleLikeWyrPost,
} from '../models/toggleLikeWyrPost';
import { WyrPost } from '../models/WyrPost';

const useToggleLikeWyrPost = (wyrPost: WyrPost) => {
  const [likedPostId, setLikedPostId] = useState<string | null>(null);
  const [toggleLikeResult, toggleLike] = useMutation<{
    toggleLikeWyrPost: ToggleLikeWyrPost;
  }>(TOGGLE_LIKE_WYR_POST_MUTATION);

  const toggleLikeWyrPost = async (isLiked: boolean) => {
    try {
      const promise = toggleLike({
        isLiked,
        postId: wyrPost.postId,
      });
      promise
        .then((result) => {
          if (result.data?.toggleLikeWyrPost.status) {
            setLikedPostId(wyrPost.postId);
          } else {
            console.log('error: ', result.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return promise;
    } catch (e) {
      console.log(e);
    }
  };

  const toggleLikeState: UseMutationState = useMemo(() => {
    if (likedPostId === wyrPost.postId) {
      return toggleLikeResult;
    } else {
      return {
        data: undefined,
        error: undefined,
        fetching: false,
        stale: true,
      };
    }
  }, [likedPostId, wyrPost]);

  return {
    state: {
      toggleLikeState,
    },
    actions: {
      toggleLikeWyrPost,
    },
  };
};

export { useToggleLikeWyrPost };
