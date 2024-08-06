'use client';

import {
  Avatar,
  Box,
  IconButton,
  SxProps,
  Theme,
  Typography as _Typography,
  styled,
} from '@mui/material';
import { useWyrComments } from '../../graphql/hooks/useWyrComments';
import { WyrPost } from '../../graphql/models/WyrPost';
import colors from '@/styles/colors.config';
import {
  LucideMessageCircleQuestion,
  MessageSquareWarning,
} from 'lucide-react';
import MaxLineTypography from '@/components/MaxLineTypography';
import { PostComment } from '../../graphql/models/WyrPostComment';
import assets from '@/constants';
import { formatTimeConcise } from '@/utils/formatTime';
import { useMemo } from 'react';
import Link from 'next/link';
import { LikeButton } from '../LikeButton';
import { formatCounts } from '@/utils/formatCounts';
import { InfinityScrollComponent } from './ScrollingCommentSection';

const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

const ScrollingCommentSection: React.FC<{
  wyrPost: WyrPost;
  onClickUrl: string;
}> = ({ wyrPost, onClickUrl }) => {
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
  const listPostComments = listPostCommentsState.data.listPostComments;
  const comments = listPostCommentsState.data.listPostComments.comments;
  const hasNext = useMemo(
    () => Boolean(listPostComments.nextKey),
    [listPostComments.nextKey],
  );
  const loading = useMemo(
    () => listPostCommentsState.fetching,
    [listPostCommentsState.fetching],
  );
  const isNoComments = useMemo(() => {
    return !hasNext && !loading && comments.length === 0;
  }, [hasNext, loading, comments.length]);

  return (
    <Box // comment Section
      id="comment section"
      sx={{
        // minHeight: '20vh',
        minHeight: '70vh',
        width: '100%',
        padding: '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
      }}
    >
      <CaptionTitle wyrPost={wyrPost} onClickUrl={onClickUrl} />
      <Box sx={{ paddingTop: '8px' }}></Box>
      {comments.map((comment, index) => {
        return (
          <CommentRow
            onClickUrl={onClickUrl}
            key={index + comment.commentId}
            comment={comment}
            sx={{
              padding: '8px 0px',
            }}
          />
        );
      })}

      <InfinityScrollComponent
        hasNext={hasNext}
        loading={loading}
        queryNext={() => queryNextWyrComments()}
        isNoItems={isNoComments}
      />

      <Box sx={{ paddingTop: '40px' }}></Box>
    </Box>
  );
};

export default ScrollingCommentSection;

const CaptionTitle: React.FC<{
  wyrPost: WyrPost;
  onClickUrl: string;
}> = ({ wyrPost, onClickUrl }) => {
  return (
    <Box // caption
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <LucideMessageCircleQuestion
        size={28}
        style={{
          minWidth: '28px',
          color: colors.primarySwatch.lavender.primary,
        }}
      />
      <Box sx={{ paddingLeft: '8px' }}></Box>
      <MaxLineTypography
        variant="titleLarge"
        sx={{
          color: colors.neutralSwatch.main[10],
          '& .MuiTypography-root': {
            transform: 'translateY(2px)',
            textAlign: 'left',
          },
        }}
      >
        {wyrPost.postContent.caption || 'Pick your side'}
      </MaxLineTypography>
    </Box>
  );
};

export const CommentRow: React.FC<{
  comment: PostComment;
  sx?: SxProps<Theme>;
  onClickUrl: string;
}> = ({ comment, sx, onClickUrl }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '8px',
          ...sx,
        }}
      >
        <AvatarSection comment={comment} onClickUrl={onClickUrl} />
        <Box // middle section
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <CommentAuthorSection comment={comment} onClickUrl={onClickUrl} />
          <Typography
            variant="bodyMedium"
            sx={{
              color: colors.neutralSwatch.main[10],
            }}
          >
            {comment.content}
          </Typography>

          <ReplyDetailBtn comment={comment} onClickUrl={onClickUrl} />
        </Box>
        <LikeBtnSection comment={comment} onClickUrl={onClickUrl} />
      </Box>
    </>
  );
};

export const AvatarSection: React.FC<{
  comment: PostComment;
  onClickUrl: string;
  size?: number;
}> = ({ comment, size = 34, onClickUrl }) => {
  return (
    <Avatar
      src={comment.profileAvatarUrl || assets.images.app.defaultAvatar}
      sx={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export const CommentAuthorSection: React.FC<{
  comment: PostComment;
  isBig?: boolean;
  onClickUrl: string;
}> = ({ comment, isBig = false, onClickUrl }) => {
  const commentAuthorRepr = useMemo(() => {
    // max charactor of 10
    return (
      comment.profileName ||
      comment.userHandle ||
      comment.personaId.slice(0, 2) + '...' + comment.personaId.slice(-4)
    );
  }, [comment]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Typography
        variant={isBig ? 'titleMedium' : 'titleSmall'}
        sx={{
          color: colors.primarySwatch.main[40],
          transform: 'translateY(2px)',
        }}
      >
        {commentAuthorRepr}
      </Typography>
      <Box sx={{ paddingLeft: '8px' }}></Box>
      <Typography
        variant={isBig ? 'bodyLarge' : 'bodyMedium'}
        sx={{
          color: colors.neutralSwatch.main[50],
        }}
      >
        {formatTimeConcise(comment.editedAt || comment.createdAt)}
      </Typography>
      <Link href={onClickUrl} target="_blank">
        <IconButton onClick={() => {}}>
          <MessageSquareWarning size={isBig ? 18 : 16} />
        </IconButton>
      </Link>
    </Box>
  );
};

const ReplyDetailBtn: React.FC<{
  comment: PostComment;
  onClickUrl: string;
}> = ({ comment, onClickUrl }) => {
  return (
    <Link href={onClickUrl} target="_blank">
      <Typography
        variant="labelMedium"
        sx={{
          color: colors.primarySwatch.main[40],
          // transform: 'translateY(2px)',
          paddingTop: '8px',
        }}
      >
        {(comment.replyCount || 0) > 0
          ? `${comment.replyCount} replies`
          : 'Reply'}
      </Typography>
    </Link>
  );
};

const LikeBtnSection: React.FC<{
  comment: PostComment;
  onClickUrl: string;
}> = ({ comment, onClickUrl }) => {
  return (
    <Box
      sx={{
        color: colors.neutralSwatch.main[50],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          padding: '8px',
        }}
      >
        <Link href={onClickUrl} target="_blank">
          <LikeButton isLiked={false} onClick={() => {}} size={18} />
        </Link>
      </Box>
      <Typography
        variant="bodyMedium"
        sx={{
          minWidth: '16px',
          textAlign: 'center',
        }}
      >
        {formatCounts(comment.votes)}
      </Typography>
    </Box>
  );
};
