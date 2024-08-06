'use client';
import { NextPage } from 'next';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import { useEffect, useMemo, useRef } from 'react';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import {
  Box,
  IconButton,
  SxProps,
  Theme,
  Typography as _Typography,
  styled,
} from '@mui/material';

// component
import {
  InfinityScrollComponent,
  // CommentAuthorSection,
  AvatarSection,
  LikeBtnSection,
  CommentAuthorSection,
  ReportFunctionProps,
  LikeFunctionProps,
} from '../../components/ScollingSection/ScrollingCommentSection';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import BottomInputBar from '../../components/ScollingSection/BottomInputBar.reply';

// model
import { PostChildComment } from '../../graphql/models/listPostChildComments';
import colors from '@/styles/colors.config';

// hook
import useCommunity from '@/hooks/useCommunity';
import { useAddChildComment } from '../../graphql/hooks/useAddChildComment';
import { useWyrChildComments } from '../../graphql/hooks/useWyrChildComments';
import { useGetPostCommentById } from '../../graphql/hooks/useGetWyrCommentById';

// hook
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { formatTimeConcise } from '@/utils/formatTime';
import { useInView } from 'framer-motion';
import { X } from 'lucide-react';

const Typography = styled(_Typography)(({ theme }) => ({
  textAlign: 'left',
}));

type PageProps = {
  params: {
    locale: string;
    qid: string;
    encodedCommentId: string;
    onClose?: () => void;
  };
  // searchParams: { [key: string]: string | string[] | undefined }
};

const _usePageState = (qid: string, encodedCommentId: string) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const commentId = decodeURIComponent(encodedCommentId);

  const bottomRef = useRef<HTMLDivElement>(null);
  //

  const {
    state: { postCommentState },
    actions: { refreshPostComment },
  } = useGetPostCommentById(commentId);
  const {
    state: { listPostChildCommentsState },
    actions: {
      refreshWyrComments,
      queryNextWyrComments,
      insertComment,
      reportCommentById,
      toggleLikePostCommentById,
    },
  } = useWyrChildComments(commentId, community.community_id);
  const {
    state: { addChildCommentState },
    actions: { addChildComment },
  } = useAddChildComment(community);

  const _comment = useMemo(() => {
    const _c = postCommentState.data?.getPostComment;
    return _c;
  }, [postCommentState.data, commentId]);

  const _init = useMemo(() => {
    const _ =
      Boolean(listPostChildCommentsState.data) &&
      Boolean(_comment?.commentId) &&
      Boolean(communityProfile.community_id);
    return _;
  }, [
    listPostChildCommentsState.data?.listChildPostComments.statusCode,
    _comment?.commentId,
    communityProfile,
  ]);

  return {
    state: {
      init: _init,
      comment: _comment,
      listPostChildCommentsState,
      addChildCommentState,
      communityProfile,
      bottomRef,
    },
    actions: {
      refreshWyrComments,
      queryNextWyrComments,
      addChildComment: (msg: string, commentId: string) => {
        return addChildComment(msg, commentId).then((result) => {
          // console.log(result, "result", formatTimeConcise(result.data?.replyComment.reference.created_at || 0));
          if (result.data) {
            insertComment({
              commentId: result.data?.replyComment.reference.comment_id,
              content: result.data?.replyComment.reference.content,
              // createdAt: result.data?.replyComment.reference.created_at, // TODO: backend return  is wrong
              createdAt: Date.now(),
              isEdited: result.data?.replyComment.reference.is_edited,
              personaId: result.data?.replyComment.reference.persona_id,
              replyCount: result.data?.replyComment.reference.reply_count,
              votes: result.data?.replyComment.reference.votes,
              reportCount: result.data?.replyComment.reference.report_count,
              isRemoved: result.data?.replyComment.reference.is_removed,
              removeReason: result.data?.replyComment.reference.remove_reason,
              updatedAt: result.data?.replyComment.reference.updated_at,
              editedAt: result.data?.replyComment.reference.edited_at,
            } as PostChildComment);
          }

          if (
            bottomRef.current &&
            window &&
            listPostChildCommentsState.data.listChildPostComments.comments
              .length > 4
          ) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            // window.scrollTo({
            //   top: document.body.scrollHeight,
            //   behavior: 'smooth',
            // });
          }
        });
      },
      reportChildCommentById: reportCommentById,
      toggleLikePostCommentById,
    },
  };
};

const Page: NextPage<PageProps> = ({
  params: { locale, qid, encodedCommentId, onClose },
}) => {
  const {
    state: {
      init,
      comment: _comment,
      listPostChildCommentsState,
      addChildCommentState,
      communityProfile,
      bottomRef,
    },
    actions: {
      queryNextWyrComments,
      addChildComment,
      reportChildCommentById,
      toggleLikePostCommentById,
    },
  } = _usePageState(qid, encodedCommentId);

  // variables
  const replies = useMemo(() => {
    return (
      listPostChildCommentsState.data?.listChildPostComments.comments || []
    );
  }, [listPostChildCommentsState.data?.listChildPostComments.comments]);
  const comment = useMemo(() => {
    return _comment!;
  }, [_comment]);

  if (!init) {
    return <LoadingPage />;
  }

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={
              <Typography variant="titleMedium" sx={{}}>
                Comments
              </Typography>
            }
            backButton={
              onClose ? (
                <>
                  <IconButton onClick={onClose}>
                    <X />
                  </IconButton>
                </>
              ) : (
                <BackIconButton />
              )
            }
          />
        }
        mainBody={
          <MainBody
            sx={{
              color: 'text.primary',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: '16px 16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: '8px',
                width: '100%',
              }}
            >
              {/* Big Comment Author Avatar */}
              <AvatarSection
                comment={comment}
                size={48}
                communityProfile={communityProfile}
              />
              <Box // main section
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
              >
                {/* Big Comment */}
                <CommentAuthorSection
                  key="main comment author section"
                  comment={comment}
                  reportComment={reportChildCommentById}
                  isBig={true}
                  communityProfile={communityProfile}
                />
                <Typography
                  variant="bodyMedium"
                  sx={{
                    color: colors.neutralSwatch.main[10],
                    textAlign: 'left',
                  }}
                >
                  {comment.content}
                </Typography>
                <Box sx={{ paddingTop: '8px' }}></Box>

                {/* Replies */}
                <InfinityScrollComponent
                  queryNext={queryNextWyrComments}
                  hasNext={Boolean(
                    listPostChildCommentsState.data?.listChildPostComments
                      .nextKey,
                  )}
                  loading={listPostChildCommentsState.fetching}
                  isNoItems={replies.length === 0}
                  auto={false}
                  sx={{
                    display: listPostChildCommentsState.data
                      ?.listChildPostComments.nextKey
                      ? 'flex'
                      : 'none',
                    margin: '0px',
                  }}
                />
                {replies.map((reply, index) => {
                  return (
                    <Box
                      // ref={index == (replies.length - 1) ? bottomRef : undefined}
                      key={index}
                    >
                      <ReplytRow
                        comment={reply}
                        communityProfile={communityProfile}
                        sx={{
                          paddingTop: '16px',
                        }}
                        reportChildCommentById={reportChildCommentById}
                        likeFunctionProps={{
                          isInitiallyLiked: reply.isLiked,
                          originalLikeCount: reply.votes,
                          toggleLike: (isLiked: boolean) => {
                            return toggleLikePostCommentById(isLiked, reply);
                          },
                        }}
                      />
                    </Box>
                  );
                })}
                <Box
                  sx={{ paddingBottom: '80px' }}
                  aria-label="spacer"
                  ref={bottomRef}
                />
              </Box>
            </Box>
          </MainBody>
        }
        botMaxWidth="unset"
        bottomNavbar={
          <BottomInputBar
            sx={{}}
            comment={comment!}
            sendMessageState={addChildCommentState}
            sendMessage={(msg: string) => {
              if (comment) {
                addChildComment(msg, comment!.commentId);
              }
            }}
          />
        }
      />
    </>
  );
};

export default Page;

// other components
const ReplytRow: React.FC<{
  comment: PostChildComment;
  likeFunctionProps: LikeFunctionProps;
  sx?: SxProps<Theme>;
  communityProfile: CommunityProfile;
  reportChildCommentById: ReportFunctionProps['reportComment'];
}> = ({
  comment,
  sx,
  reportChildCommentById,
  likeFunctionProps,
  communityProfile,
}) => {
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
        <AvatarSection comment={comment} communityProfile={communityProfile} />
        <Box // middle section
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <CommentAuthorSection
            comment={comment}
            reportComment={reportChildCommentById}
            communityProfile={communityProfile}
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
        </Box>
        <LikeBtnSection
          comment={comment}
          likeFunctionProps={likeFunctionProps}
        />
      </Box>
    </>
  );
};
