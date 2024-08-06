'use client';
// models
import { WyrPost } from '../models/WyrPost';
import { Community } from '@/data/services/fetchCommunityService';
import { useVoteWyrPost } from './useVoteWyrPost';
import { useToggleLikeWyrPost } from './useToggleLikeWyrPost';
import { useViewWyrPost } from './useViewWyrPost';
import { useWyrComments } from './useWyrComments';
import { useAddComment } from './useAddComment';
import { useEffect } from 'react';
import { PostComment } from '../models/WyrPostComment';

/**
 * Need Refactoring
 * @param postId
 * @returns
 */
const useWyrPost = (wyrPost: WyrPost, community: Community) => {
  // hooks
  const {
    state: { voteState },
    actions: { voteWyrPost, skipWyrPost },
  } = useVoteWyrPost(wyrPost, community);
  const {
    state: { toggleLikeState },
    actions: { toggleLikeWyrPost },
  } = useToggleLikeWyrPost(wyrPost);
  const {
    state: { viewWyrPostState },
    actions: { viewWyrPost },
  } = useViewWyrPost(wyrPost);
  const {
    state: { listPostCommentsState },
    actions: {
      refreshWyrComments,
      queryNextWyrComments,
      insertComment,
      reportCommentById,
      toggleLikePostCommentById,
    },
  } = useWyrComments(wyrPost);
  const {
    state: { addCommentState },
    actions: { addComment },
  } = useAddComment(community);

  return {
    state: {
      voteState,
      toggleLikeState,
      viewWyrPostState,
      listPostCommentsState,
      addCommentState,
    },
    actions: {
      voteWyrPost,
      toggleLikeWyrPost,
      skipWyrPost,
      viewWyrPost,
      refreshWyrComments,
      queryNextWyrComments,
      addComment: (content: string, postId: string, postType: string) => {
        const promise = addComment(content, postId, postType).then((result) => {
          if (result.data?.addComment.reference.comment_id) {
            insertComment({
              commentId: result.data?.addComment.reference.comment_id,
              content: result.data?.addComment.reference.content,
              createdAt: result.data?.addComment.reference.created_at,
              isEdited: result.data?.addComment.reference.is_edited,
              personaId: result.data?.addComment.reference.persona_id,
              replyCount: result.data?.addComment.reference.reply_count,
              votes: result.data?.addComment.reference.votes,
              reportCount: result.data?.addComment.reference.report_count,
              isRemoved: result.data?.addComment.reference.is_removed,
              removeReason: result.data?.addComment.reference.remove_reason,
              updatedAt: result.data?.addComment.reference.updated_at,
              editedAt: result.data?.addComment.reference.edited_at,
            } as PostComment);
          }
        });
        return promise;
      },
      reportCommentById,
      toggleLikePostCommentById,
    },
  };
};

export { useWyrPost };
