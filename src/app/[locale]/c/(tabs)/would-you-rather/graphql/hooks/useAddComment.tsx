'use client';
// client
import { useMutation, useQuery } from 'urql';

// models / query
import { addComment, ADD_COMMENT_MUTATION } from '../models/addComment';
import { WyrPost } from '../models/WyrPost';
import { Community } from '@/data/services/fetchCommunityService';

export const useAddComment = (community: Community) => {
  const [result, addComment] = useMutation<{ addComment: addComment }>(
    ADD_COMMENT_MUTATION,
  );

  return {
    state: {
      addCommentState: result,
    },
    actions: {
      addComment: (content: string, postId: string, postType: string) => {
        const promise = addComment({
          content,
          postId,
          postType,
          communityId: community.community_id,
        });
        return promise;
      },
    },
  };
};
