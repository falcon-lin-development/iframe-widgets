'use client';
import { useMemo, useEffect, useState, useRef } from 'react';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  ListPostChildComments,
  PostChildComment,
  List_POST_CHILD_COMMENT_QUERY,
} from '../models/listPostChildComments';
import { useStatelessReportComment } from './useStatelessReportComment';
import { useStatelessToggleLikePostComment } from './useStatelessToggleLikePostComment';

export const useWyrChildComments = (commentId: string, communityId: string) => {
  const [nextKey, setNextKey] = useState<string>('');
  const [commentBuffer, setCommentBuffer] = useState<PostChildComment[]>([]);
  const [result, reexecuteQuery] = useQuery<{
    listChildPostComments: ListPostChildComments;
  }>({
    query: List_POST_CHILD_COMMENT_QUERY,
    variables: {
      commentId: commentId,
      communityId: communityId,
      nextKey,
      pageSize: 5,
    },
    requestPolicy: 'network-only',
  });
  const {
    actions: { reportCommentByIds },
  } = useStatelessReportComment();
  const {
    actions: { toggleLikePostCommentByIds },
  } = useStatelessToggleLikePostComment();

  useEffect(() => {
    const _mergeList = (
      oldList: PostChildComment[],
      newList: PostChildComment[],
    ) => {
      let newBuffer;
      if (oldList.length === 0) {
        newBuffer = newList;
      } else {
        // const lastSortKey = oldList[oldList.length - 1].votesTs;
        const firstSortKey = oldList[0].createdAt;
        newBuffer = [
          ...newList.filter(
            (v: PostChildComment) => v.createdAt < firstSortKey,
          ),
          ...oldList,
        ];
      }
      return newBuffer;
    };

    //  if data, merge list
    if (result.data) {
      const newBuffer = _mergeList(
        nextKey === '' ? [] : commentBuffer, // for new fetch, lastId is empty, negect old list
        result.data.listChildPostComments.comments,
      );
      setCommentBuffer(newBuffer);
      console.log(
        'wyr comment replies',
        result,
        newBuffer,
        commentId,
        communityId,
      );
    }
  }, [result.data]);

  return {
    state: {
      listPostChildCommentsState: {
        data: {
          listChildPostComments: {
            ...result.data?.listChildPostComments,
            comments: commentBuffer,
          } as ListPostChildComments,
        },
        error: result.error,
        fetching: result.fetching,
        stale: result.stale,
        extensions: result.extensions,
      },
    },
    actions: {
      refreshWyrComments: () => {
        // lastId.current = '';
        if (nextKey !== '') {
          setNextKey('');
        } else {
          reexecuteQuery({ requestPolicy: 'network-only' });
        }
      },
      queryNextWyrComments: () => {
        if (result.data?.listChildPostComments.nextKey) {
          setNextKey(result.data.listChildPostComments.nextKey);
        }
      },
      insertComment: (comment: PostChildComment) => {
        setCommentBuffer([...commentBuffer, comment]);
      },
      reportCommentById: (reason: string, comment: PostChildComment) => {
        const promise = reportCommentByIds({
          reason,
          commentId: comment.commentId,
          communityId: comment.communityId,
        });
        return promise;
      },
      toggleLikePostCommentById: (
        isLiked: boolean,
        comment: PostChildComment,
      ) => {
        const promise = toggleLikePostCommentByIds({
          isLiked,
          commentId: comment.commentId,
          communityId: comment.communityId,
        });
        return promise;
      },
    },
  };
};
