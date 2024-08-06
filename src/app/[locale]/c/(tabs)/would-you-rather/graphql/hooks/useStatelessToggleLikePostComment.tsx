'use client';
import React, { useState, useMemo } from 'react';

// client
import { CombinedError, UseMutationState, useMutation, useQuery } from 'urql';

// models
import {
  TOGGLE_LIKE_POST_COMMENT_MUTATION,
  ToggleLikePostComment,
} from '../models/toggleLikePostComment';
import { PostComment } from '../models/WyrPostComment';

const useStatelessToggleLikePostComment = () => {
  const [likedCommentId, setLikedCommentId] = useState<string | null>(null);
  const [toggleLikeResult, toggleLike] = useMutation<{
    toggleLikePostComment: ToggleLikePostComment;
  }>(TOGGLE_LIKE_POST_COMMENT_MUTATION);

  const toggleLikePostCommentByIds = async ({
    isLiked,
    commentId,
    communityId,
  }: {
    isLiked: boolean;
    commentId: string;
    communityId: string;
  }) => {
    try {
      const promise = toggleLike({
        isLiked,
        commentId: commentId,
        communityId: communityId,
      });
      promise
        .then((result) => {
          if (result.data?.toggleLikePostComment.status) {
            setLikedCommentId(commentId);
            // console.log('success: ', result);
          } else {
            console.log('error: ', result);
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

  // const toggleLikeState: UseMutationState = useMemo(() => {
  //     if (likedCommentId === postComent.commentId) {
  //         return toggleLikeResult;
  //     } else {
  //         return {
  //             data: undefined,
  //             error: undefined,
  //             fetching: false,
  //             stale: true,
  //         };
  //     }
  // }, [likedCommentId, postComent.commentId]);

  return {
    state: {
      // toggleLikeState,
    },
    actions: {
      toggleLikePostCommentByIds,
    },
  };
};

export { useStatelessToggleLikePostComment };
