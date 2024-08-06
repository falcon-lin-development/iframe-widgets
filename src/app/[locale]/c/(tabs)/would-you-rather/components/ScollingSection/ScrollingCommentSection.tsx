'use client';
// pages/_app.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// components
import { Avatar, Box, Divider, Snackbar } from '@mui/material';
import { SxProps, Theme, styled } from '@mui/material/styles';
import { Typography as _Typography, IconButton } from '@mui/material';
import {
  MessageSquareWarning,
  LucideMessageCircleQuestion,
} from 'lucide-react';
import { SectionsBottomModalSheet } from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import MaxLineTypography from '@/components/MaxLineTypography';
import { LoadingButton } from '@mui/lab';
import { LikeButton } from '../LikeButton';
import ReplyPageModalSheet from '../../[qid]/[encodedCommentId]/ReplyPageModalSheet.client';

// utils
import { formatTimeConcise } from '@/utils/formatTime';

// constant
import colors from '@/styles/colors.config';
import { WyrPost } from '../../graphql/models/WyrPost';
import routes from '@/routes/routes';
import assets from '@/constants';
import { PostComment } from '../../graphql/models/WyrPostComment';

// hooks
import {
  GAMESTATE,
  INGAMESTATE,
  GameStateHook,
} from '../gameScene/useGameState';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import { AnyVariables, OperationResult } from 'urql';
import { ReportComment } from '../../graphql/models/reportComment';
import { ReportReasonOptions } from './ScrollingSectionSelectionOptions';
import { UseLikeHookProp, useLikeHook } from '../gameScene/useLikeHook';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';

const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

export type ReportFunctionProps = {
  reportComment: (
    reason: string,
    comment: PostComment,
  ) => Promise<
    OperationResult<
      {
        reportComment: ReportComment;
      },
      AnyVariables
    >
  >;
};

export type LikeFunctionProps = UseLikeHookProp;

// Scrolling Comment Section
const ScrollingCommentSection: React.FC<{
  wyrPost: WyrPost;
  gameContext: GameStateHook;
}> = ({ wyrPost, gameContext }) => {
  const listPostComments =
    gameContext.state.listPostCommentsState.data.listPostComments;
  const comments = listPostComments.comments;
  const hasNext = useMemo(
    () => Boolean(listPostComments.nextKey),
    [listPostComments.nextKey],
  );
  const loading = useMemo(
    () => gameContext.state.listPostCommentsState.fetching,
    [gameContext.state.listPostCommentsState.fetching],
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
      <CaptionTitle wyrPost={wyrPost} />
      <Box sx={{ paddingTop: '8px' }}></Box>
      {comments.map((comment, index) => {
        return (
          <CommentRow
            key={index + comment.commentId}
            comment={comment}
            reportComment={gameContext.actions.reportCommentById}
            gameContext={gameContext}
            likeFunctionProps={{
              isInitiallyLiked: comment.isLiked,
              originalLikeCount: comment.votes,
              toggleLike: (isLiked) =>
                gameContext.actions.toggleLikePostCommentById(isLiked, comment),
            }}
            sx={{
              padding: '8px 0px',
            }}
          />
        );
      })}

      <InfinityScrollComponent
        hasNext={hasNext}
        loading={loading}
        queryNext={() => gameContext.actions.queryNextWyrComments()}
        isNoItems={isNoComments}
      />

      <Box sx={{ paddingTop: '40px' }}></Box>
    </Box>
  );
};

export default ScrollingCommentSection;

// Other components
// Comment Section
const CaptionTitle: React.FC<{
  wyrPost: WyrPost;
}> = ({ wyrPost }) => {
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

/**
 * Comment Row
 *  */
export const CommentRow: React.FC<{
  comment: PostComment;
  reportComment: ReportFunctionProps['reportComment'];
  likeFunctionProps: LikeFunctionProps;
  gameContext: GameStateHook;
  sx?: SxProps<Theme>;
}> = ({ comment, sx, reportComment, likeFunctionProps, gameContext }) => {
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
        <AvatarSection
          comment={comment}
          communityProfile={gameContext.state.communityProfile}
        />
        <Box // middle section
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <CommentAuthorSection
            comment={comment}
            reportComment={reportComment}
            communityProfile={gameContext.state.communityProfile}
          />
          <Typography
            variant="bodyMedium"
            sx={{
              color: colors.neutralSwatch.main[10],
              overflowWrap: 'anywhere',
            }}
          >
            {comment.content}
          </Typography>

          <ReplyDetailBtn comment={comment} />
        </Box>
        <LikeBtnSection
          comment={comment}
          likeFunctionProps={likeFunctionProps}
        />
      </Box>
    </>
  );
};

export const AvatarSection: React.FC<{
  comment: PostComment;
  communityProfile: CommunityProfile;
  size?: number;
}> = ({ comment, size = 34, communityProfile }) => {
  return (
    <Avatar
      src={
        comment.profileAvatarUrl ||
        communityProfile.profile_avatar_url ||
        assets.images.app.defaultAvatar
      }
      sx={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};
export const CommentAuthorSection: React.FC<{
  comment: PostComment;
  reportComment: ReportFunctionProps['reportComment'];
  communityProfile: CommunityProfile;
  isBig?: boolean;
}> = ({ comment, reportComment, isBig = false, communityProfile }) => {
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);
  const [reportSnackbarOpen, setReportSnackbarOpen] = useState(false);
  const [alreadyReportedSnackbarOpen, setAlreadyReportedSnackbarOpen] =
    useState(false);
  const [reportReason, setReportReason] = useState<string | null>('');
  const commentAuthorRepr = useMemo(() => {
    // max charactor of 10
    return (
      comment.profileName ||
      communityProfile.profile_name ||
      comment.userHandle ||
      comment.personaId.slice(0, 2) + '...' + comment.personaId.slice(-4)
    );
  }, [comment, communityProfile]);

  useEffect(() => {
    if (reportReason && reportReason.length > 0) {
      reportComment(reportReason, comment)
        .then((result) => {
          //   console.log(result);
          if (result.data?.reportComment.reference?.success) {
            setReportSnackbarOpen(true);
          } else {
            console.log(result.data, reportReason, comment);
            setAlreadyReportedSnackbarOpen(true);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setReportReason(null);
        });
    }
  }, [reportReason]);

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
      <IconButton
        onClick={() => {
          setIsReportSheetOpen(true);
        }}
      >
        <MessageSquareWarning size={isBig ? 18 : 16} />
      </IconButton>

      {/* Bars */}
      <SectionsBottomModalSheet // report sheet
        isOpen={isReportSheetOpen}
        setOpen={setIsReportSheetOpen}
        setSelectedValue={(selectedReasonIndex) => {
          const _selectedReason =
            ReportReasonOptions[selectedReasonIndex].title;
          console.log(_selectedReason);
          if (_selectedReason) {
            setReportReason(_selectedReason);
          }
        }}
        info={{
          options: ReportReasonOptions,
        }}
      />
      <Snackbar
        open={reportSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setReportSnackbarOpen(false)}
        message="Reported Successfully"
      />
      <Snackbar
        open={alreadyReportedSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setAlreadyReportedSnackbarOpen(false)}
        message="You've Reported this comment already"
      />
    </Box>
  );
};
const ReplyDetailBtn: React.FC<{
  comment: PostComment;
}> = ({ comment }) => {
  const { constructPath } = useAppRouting();
  const [isOpen, setIsOpen] = useState(false);
  const param = useSearchParams();

  const commentDetailUrl = useMemo(() => {
    const _path = constructPath(
      routes.c.would_you_rather.detail.comment._home,
      {
        options: {
          encodedCommentId: encodeURIComponent(comment.commentId),
        },
        searchParams: {
          tabId: param.get('tabId') || '0',
          qid: param.get('qid') || '',
        },
      },
    );
    return _path;
  }, [comment.commentId, param]);

  return (
    <>
      <Box
        onClick={() => {
          // lock the scroll
          document.body.style.overflowY = 'hidden';
          setIsOpen(true);
        }}
      >
        {/* <Link href={commentDetailUrl}> */}
        <Typography
          variant="labelMedium"
          sx={{
            color: colors.primarySwatch.main[40],
            paddingTop: '8px',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {(comment.replyCount || 0) > 0
            ? `${comment.replyCount} replies`
            : 'Reply'}
        </Typography>
        {/* </Link> */}
      </Box>
      <ReplyPageModalSheet
        isOpen={isOpen}
        onClose={() => {
          // unlock the scroll
          document.body.style.overflowY = 'scroll';
          setIsOpen(false);
        }}
        encodedCommentId={encodeURIComponent(comment.commentId)}
      />
    </>
  );
};

export const LikeBtnSection: React.FC<{
  comment: PostComment;
  likeFunctionProps: LikeFunctionProps;
}> = ({ comment, likeFunctionProps }) => {
  const {
    state: { likeCount, formatedCounts, isLiked },
    actions: { toggleLike },
  } = useLikeHook(likeFunctionProps);

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
        <LikeButton isLiked={isLiked} onClick={toggleLike} size={18} />
      </Box>
      <Typography
        variant="bodyMedium"
        sx={{
          minWidth: '16px',
          textAlign: 'center',
        }}
      >
        {formatedCounts}
      </Typography>
    </Box>
  );
};

// Infinity Scroll Component
export const InfinityScrollComponent: React.FC<{
  hasNext: boolean;
  loading: boolean;
  queryNext: () => void;
  isNoItems: boolean;
  auto?: boolean;
  sx?: SxProps<Theme>;
}> = ({ hasNext, loading, queryNext, isNoItems, auto = true, sx }) => {
  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Triggers when 10% of the element is visible
  });

  useEffect(() => {
    if (inView && hasNext && auto) {
      queryNext();
    }
  }, [inView, hasNext]);

  return (
    <>
      <>
        {isNoItems && (
          <Typography
            variant="labelSmall"
            sx={{
              fontStyle: 'italic',
              color: colors.neutralSwatch.main[80],
              padding: '8px 0px',
            }}
          >
            No contents yet
          </Typography>
        )}
      </>

      <Divider
        sx={{
          width: '100%',
          margin: '16px 0px',
          opacity: !hasNext ? 0 : 1,
          ...sx,
        }}
        ref={ref}
      >
        <LoadingButton
          variant="text"
          loading={loading}
          onClick={() => queryNext()}
          disabled={!hasNext}
        >
          <Typography variant="bodySmall">
            {hasNext ? 'Load more ' : 'End of the list'}
          </Typography>
        </LoadingButton>
      </Divider>
    </>
  );
};
