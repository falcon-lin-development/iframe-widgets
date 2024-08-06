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

// models
import { GraphqlError } from '@/data/graphql/errors';
import { WyrPost } from '../models/WyrPost';
import {
  RESPOND_WYR_POST_MUTATION,
  ResponseWyrPost,
} from '../models/voteWyrPost';
import { GET_WYR_POSTS_QUERY } from '../models/WyrPost';
import { Community } from '@/data/services/fetchCommunityService';

/**
 * Need Refactoring
 * @param postId
 * @returns
 */
const useGetWyrPostById = (postId: string) => {
  const [result, reexecuteQuery] = useQuery<{
    getWyrPost: WyrPost;
  }>({
    query: GET_WYR_POSTS_QUERY,
    variables: { postId },
    requestPolicy: 'network-only',
  });

  return {
    state: {
      wyrPostState: result,
    },
    actions: {
      // refreshWyrPost,
      refreshWyrPost: () =>
        reexecuteQuery({
          requestPolicy: 'network-only',
        }),
    },
  };
};

export { useGetWyrPostById };
