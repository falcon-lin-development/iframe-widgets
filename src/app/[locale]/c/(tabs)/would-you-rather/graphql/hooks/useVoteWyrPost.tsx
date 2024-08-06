'use client';
import React, { useEffect, useMemo, useState } from 'react';
// client
import { CombinedError, UseMutationState, useMutation, useQuery } from 'urql';

// models
import { WyrPost } from '../models/WyrPost';
import {
  RESPOND_WYR_POST_MUTATION,
  ResponseWyrPost,
} from '../models/voteWyrPost';
import { SKIP_WYR_POST_MUTATION, SkipWyrPost } from '../models/skipWyrPost';
import { Community } from '@/data/services/fetchCommunityService';

const useVoteWyrPost = (wyrPost: WyrPost, community: Community) => {
  const [votedPostId, setVotedPostId] = useState<string | null>(null);
  const [voteResult, voteWyr] = useMutation<{
    respondWyrPost: ResponseWyrPost;
  }>(RESPOND_WYR_POST_MUTATION);

  const [skipResult, skipWyr] = useMutation<{
    skipWyrPost: SkipWyrPost;
  }>(SKIP_WYR_POST_MUTATION);

  const voteState: UseMutationState = useMemo(() => {
    if (votedPostId === wyrPost.postId) {
      if (skipResult.data && !skipResult.stale) {
        return skipResult;
      } else if (voteResult.data && !voteResult.stale) {
        return voteResult;
      }
    }
    // else
    return {
      data: undefined,
      error: undefined,
      fetching: false,
      stale: true,
    };
  }, [votedPostId, wyrPost]);
  const voteWyrPost = async (vote: string) => {
    try {
      const promise = voteWyr({
        communityId: community.community_id,
        postId: wyrPost.postId,
        responseOptionId: vote,
      });

      promise
        .then((result) => {
          if (result.data?.respondWyrPost.reference.response_id) {
            setVotedPostId(wyrPost.postId);
            skipResult.stale = true;
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

  const skipWyrPost = async (skipReason: string = 'noreason') => {
    try {
      const promise = skipWyr({
        communityId: community.community_id,
        postId: wyrPost.postId,
        skipReason,
      });

      promise
        .then((result) => {
          if (result.data?.skipWyrPost.reference.response_id) {
            setVotedPostId(wyrPost.postId);
            voteResult.stale = true;
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

  return {
    state: {
      voteState,
    },
    actions: {
      voteWyrPost,
      skipWyrPost,
    },
  };
};

export { useVoteWyrPost };
