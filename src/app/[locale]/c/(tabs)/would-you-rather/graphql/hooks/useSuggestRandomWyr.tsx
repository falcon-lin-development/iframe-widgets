'use client';
import React, {
  useContext,
  createContext,
  useMemo,
  useEffect,
  useState,
} from 'react';

// client
import { CombinedError, useMutation, useQuery } from 'urql';

// models / query
import { Community } from '@/data/services/fetchCommunityService';
import { WyrPost } from '../models/WyrPost';
import { GET_RANDOM_WYR_POST_QUERY } from '../models/suggestWyrPost';
import {
  RESPOND_WYR_POST_MUTATION,
  ResponseWyrPost,
} from '../models/voteWyrPost';
import { useSearchParams } from 'next/navigation';

export const useSuggestRandomWyr = (community: Community) => {
  /**
   * Not implemented in backend
   */
  // const [showedPostIds, setShowedPostIds] = useState<string[]>([]);
  const param = useSearchParams();

  // queries
  const [result, reexecuteQuery] = useQuery<{
    suggestRandomWyr: WyrPost;
  }>({
    query: GET_RANDOM_WYR_POST_QUERY,
    variables: { communityId: community.community_id },
    requestPolicy: 'network-only',
    // pause: true,
  });

  // post data
  const _wyrPostData = useMemo(() => {
    return result.data?.suggestRandomWyr;
  }, [result.data]);

  const init = useMemo(() => {
    return Boolean(_wyrPostData?.postId && community.community_id);
  }, [_wyrPostData]);

  // set qid
  useEffect(() => {
    const _setWyrPostId = (wyrPostId: string) => {
      if (param.get('qid') !== wyrPostId) {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('qid', wyrPostId);
          window.history.pushState({}, '', url);
        }
      }
    };

    if (init && param.get('qid') !== _wyrPostData?.postId) {
      console.log('setWyrPostId', _wyrPostData?.postId);
      _setWyrPostId(_wyrPostData!.postId);
    }
  }, [init, param.get('qid'), _wyrPostData]);

  // functions
  const nextRandomWyr = async () => {
    try {
      reexecuteQuery({ requestPolicy: 'network-only' });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    state: {
      init,
      suggestedWyrPost: _wyrPostData,
      suggestRandomWyrState: result,
    },
    actions: {
      nextRandomWyr: nextRandomWyr,
    },
  };
};
