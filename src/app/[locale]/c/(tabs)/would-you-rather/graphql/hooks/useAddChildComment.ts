'use client';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  addChildComment,
  ADD_CHILD_COMMENT_MUTATION,
} from '../models/addChildComment';
import { Community } from '@/data/services/fetchCommunityService';

export const useAddChildComment = (community: Community) => {
  const [result, addChildComment] = useMutation<{
    replyComment: addChildComment;
  }>(ADD_CHILD_COMMENT_MUTATION);

  return {
    state: {
      addChildCommentState: result,
    },
    actions: {
      addChildComment: (content: string, commentId: string) => {
        const promise = addChildComment({
          content,
          commentId,
          communityId: community.community_id,
        });
        return promise;
      },
    },
  };
};
