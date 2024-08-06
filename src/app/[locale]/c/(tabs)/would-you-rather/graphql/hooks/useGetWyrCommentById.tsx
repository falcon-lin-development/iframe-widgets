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
import { PostComment, GET_POST_COMMENT_QUERY } from '../models/WyrPostComment';

const useGetPostCommentById = (commentId: string) => {
  const [result, reexecuteQuery] = useQuery<{
    getPostComment: PostComment;
  }>({
    query: GET_POST_COMMENT_QUERY,
    variables: { commentId },
    requestPolicy: 'network-only',
  });
  // useEffect(() => {
  //     console.log("result", result);
  // }, [result]);

  return {
    state: {
      postCommentState: result,
    },
    actions: {
      refreshPostComment: () =>
        reexecuteQuery({
          requestPolicy: 'network-only',
        }),
    },
  };
};

export { useGetPostCommentById };
