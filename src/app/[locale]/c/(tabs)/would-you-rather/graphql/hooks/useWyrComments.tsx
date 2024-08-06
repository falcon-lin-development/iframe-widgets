'use client';
import { useMemo, useEffect, useState, useRef } from 'react';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  ListPostComments,
  List_POST_COMMENT_QUERY,
} from '../models/listPostComments';
import { PostComment } from '../models/WyrPostComment';
import { WyrPost } from '../models/WyrPost';
import { useStatelessReportComment } from './useStatelessReportComment';
import { useStatelessToggleLikePostComment } from './useStatelessToggleLikePostComment';

export const useWyrComments = (wyrPost: WyrPost) => {
  const [nextKey, setNextKey] = useState<string>('');
  const [commentBuffer, setCommentBuffer] = useState<PostComment[]>([]);
  const [result, reexecuteQuery] = useQuery<{
    listPostComments: ListPostComments;
  }>({
    query: List_POST_COMMENT_QUERY,
    variables: {
      postId: wyrPost.postId,
      postType: wyrPost.postType,
      communityId: wyrPost.communityId,
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
    const _mergeList = (oldList: PostComment[], newList: PostComment[]) => {
      let newBuffer;
      if (oldList.length === 0) {
        newBuffer = newList;
      } else {
        const lastSortKey = oldList[oldList.length - 1].votesTs;

        newBuffer = [
          ...oldList,
          ...newList.filter((v: PostComment) => {
            return v.votesTs < lastSortKey;
          }),
        ];
      }
      return newBuffer;
    };

    //  if data, merge list
    if (result.data) {
      const newBuffer = _mergeList(
        nextKey === '' ? [] : commentBuffer, // for new fetch, lastId is empty, negect old list
        result.data.listPostComments.comments,
      );
      setCommentBuffer(newBuffer);
      // console.log('wyr comments', result, newBuffer);
    }
  }, [result.data]);

  return {
    state: {
      listPostCommentsState: {
        data: {
          listPostComments: {
            ...result.data?.listPostComments,
            comments: commentBuffer,
          } as ListPostComments,
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
        if (result.data?.listPostComments.nextKey) {
          setNextKey(result.data.listPostComments.nextKey);
        }
      },
      insertComment: (comment: PostComment) => {
        setCommentBuffer([comment, ...commentBuffer]);
      },
      reportCommentById: (reason: string, comment: PostComment) => {
        // console.log(reason, comment);
        const promise = reportCommentByIds({
          reason,
          commentId: comment.commentId,
          communityId: comment.communityId,
        });
        return promise;
      },
      toggleLikePostCommentById: (isLiked: boolean, comment: PostComment) => {
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
