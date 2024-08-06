'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// components
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Snackbar,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import {
  Heart,
  MessageCircle,
  LucideMessageCircleQuestion,
  MoreHorizontal,
  MessageCircleWarning,
  MessageSquare,
} from 'lucide-react';
import DefaultPicker, { PickerOrientation } from '../pickers/DefaultPicker';
import { LikeButton } from '../LikeButton';
import { SponsoredChip } from '../SponsorChip';
import MaxLineTypography from '@/components/MaxLineTypography';

// const
import colors from '@/styles/colors.config';
import { PostCategory, WyrPost, isWyrPost } from '../../graphql/models/WyrPost';

// hooks
import { GameStateHook, useGameState } from '../gameScene/useGameState';
import { useLikeHook } from '../gameScene/useLikeHook';
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import { ListPostComments } from '../../graphql/models/listPostComments';
import { PostComment } from '../../graphql/models/WyrPostComment';
import assets from '@/constants';
import Link from 'next/link';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import ShareButton from '@/components/buttons/ShareButton.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useSearchParams } from 'next/navigation';

const WyrPostCard: React.FC<{
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ sx, wyrPost }) => {
  const gameState = useGameState({ wyrPost });
  const _isWyrPost = isWyrPost(wyrPost);

  if (!_isWyrPost.isValid) {
    console.log(`WyrCard: ${_isWyrPost.error}`, wyrPost);
    return <></>;
  }

  return (
    <Box
      sx={{
        color: colors.neutralSwatch.main[10],
        width: '100%',
        borderRadius: '8px',
        ...sx,
      }}
    >
      <TopBar
        wyrPost={wyrPost}
        sx={{
          padding: '8px 16px',
          // margin: '0px 16px',
        }}
      />
      <DefaultPicker
        wyrPost={wyrPost}
        gameContext={gameState}
        sx={{
          aspectRatio: '375 / 343',
        }}
      />
      <BotSection
        wyrPost={wyrPost}
        gameState={gameState}
        sx={{
          padding: '12px 16px',
        }}
      />
    </Box>
  );
};

export default WyrPostCard;

/**
 * Others
 */

const TopBar: React.FC<{
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, sx }) => {
  enum OptionType {
    Report = 'report',
  }
  const options: SelectionOption[] = [
    // {
    //   title: 'Report',
    //   targetValue: OptionType.Report,
    //   icon: MessageCircleWarning,
    //   sx: {
    //     color: colors.accentError,
    //   }
    // },
  ];
  const [isOpen, setOpen] = useState(false); // more hort tool bar
  const [selectedValue, setSelectedValue] = useState<OptionType | null>(null);

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const snackBarMessage = useRef<string>('');

  // control
  useEffect(() => {
    if (selectedValue === OptionType.Report) {
      console.log('selectedValue:', selectedValue);
      snackBarMessage.current = 'Reported successfully';
      setSelectedValue(null);
      setIsSnackBarOpen(true);
    }
  }, [selectedValue]);

  return (
    <>
      <Box // caption section
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          color: colors.neutralSwatch.main[40],
          alignItems: 'center',
          ...sx,
        }}
      >
        <Box
          sx={{
            // icon + title
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            maxWidth: 'calc(100% - 50px)',
          }}
        >
          <LucideMessageCircleQuestion
            size={18}
            style={{
              minWidth: '18px',
              color: colors.primarySwatch.lavender.primary,
            }}
          />
          <Box sx={{ paddingRight: '8px' }} aria-label="spacer" />
          <MaxLineTypography
            variant="titleSmall"
            sx={{
              maxWidth: 'calc(100%)',
              '& .MuiTypography-root': {
                transform: 'translateY(2px)',
                textAlign: 'left',
              },
            }}
          >
            {wyrPost.postContent.caption || 'Would you rather...'}
          </MaxLineTypography>
        </Box>
        {/* <MoreHorizontal
          onClick={() => {
            setOpen(true);
          }}
          size={18}
          style={{
            color: colors.neutralSwatch.main[30],
          }}
        /> */}
      </Box>

      <SectionsBottomModalSheet
        info={{ options }}
        isOpen={isOpen}
        setOpen={setOpen}
        setSelectedValue={setSelectedValue}
      />
      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackBarOpen(false)}
        message={snackBarMessage.current}
      />
    </>
  );
};

const BotSection: React.FC<{
  wyrPost: WyrPost;
  gameState: GameStateHook;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, gameState, sx }) => {
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <BotToolSection wyrPost={wyrPost} gameState={gameState} />
      <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
      <BotCommentSummarySection wyrPost={wyrPost} gameState={gameState} />
    </Box>
  );
};

const BotToolSection: React.FC<{
  wyrPost: WyrPost;
  gameState: GameStateHook;
}> = ({ wyrPost, gameState }) => {
  const {
    state: { isLiked, likeCount, formatedCounts },
    actions: { toggleLike },
  } = useLikeHook({
    isInitiallyLiked: wyrPost.userInteraction?.is_liked || false,
    originalLikeCount: wyrPost.viewStats.like_count,
    toggleLike: gameState.actions.toggleLikeWyrPost,
  });
  const { logButtonClick } = useLogEvent();
  const { constructPath } = useAppRouting();

  // share snackbar

  return (
    <Box // tool section
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box // front stuff
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <LikeButton isLiked={isLiked} onClick={toggleLike} size={18} />
        <Box sx={{ paddingLeft: '8px' }} aria-label="spacer" />
        <Typography
          variant="bodyMedium"
          sx={{
            minWidth: '16px',
            textAlign: 'left',
          }}
        >
          {formatedCounts}
        </Typography>
        <Box sx={{ paddingLeft: '16px' }} aria-label="spacer" />

        {wyrPost.postCategory === PostCategory.sponsored && <SponsoredChip />}
      </Box>
      <ShareButton
        shareProps={{
          logButtonClick,
          url: constructPath(routes.c.would_you_rather.detail._home, {
            options: {
              qid: wyrPost.postId,
            },
          }),
          title: wyrPost.postContent.caption || 'Would you rather...',
          text: 'Try this question',
        }}
        sx={{
          padding: '0px',
        }}
      />
    </Box>
  );
};

const BotCommentSummarySection: React.FC<{
  wyrPost: WyrPost;
  gameState: GameStateHook;
}> = ({ wyrPost, gameState }) => {
  const param = useSearchParams();
  const { constructPath } = useAppRouting();
  const listPostComments =
    gameState.state.listPostCommentsState.data.listPostComments;
  const comments = listPostComments.comments;

  const CommentRow: React.FC<{
    comment: PostComment;
  }> = ({ comment }) => {
    const commentAuthorRepr = useMemo(() => {
      const s =
        comment.profileName ||
        comment.userHandle ||
        comment.personaId.slice(0, 2) + '...' + comment.personaId.slice(-4);

      // max charactor of 15
      // if more than 15 char, than do 12 char and ...
      return s.length > 20 ? s.slice(0, 17) + '...' : s;
    }, [comment]);

    return (
      // <Box
      //   sx={{
      //     display: 'flex',
      //     flexDirection: 'column',
      //     alignItems: 'flex-start',
      //     width: '100%',
      //     // overflow: 'hidden'
      //   }}
      // >
      <Box // first line
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        width={'100%'}
        flexWrap={'wrap'}
        // overflow={'hidden'}
        // textOverflow={'ellipsis'}
      >
        <Avatar
          src={comment.profileAvatarUrl || assets.images.app.defaultAvatar}
          sx={{
            width: '20px',
            height: '20px',
          }}
        />
        <Box sx={{ paddingRight: '6px' }} aria-label="spacer" />
        <Typography
          variant="titleSmall"
          sx={{
            color: colors.primarySwatch.main[40],
            transform: 'translateY(2px)',
          }}
        >
          {commentAuthorRepr}
        </Typography>
        <Box sx={{ paddingRight: '6px' }} aria-label="spacer" />
        <Typography
          variant="bodyMedium"
          sx={{
            // flexGrow: 1,
            // display: "inline-block",
            // width: "100%",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: colors.neutralSwatch.main[10],
            textAlign: 'left',
            // whiteSpace: "nowrap",
            // maxWidth: '100%',
          }}
        >
          {/* {comment.content.split(' ').slice(0, 3).join(' ')}  */}
          {comment.content}
        </Typography>
      </Box>
      // {/* Second Line and onward*/}
      // <Typography
      //   variant="bodyMedium"
      //   sx={{
      //     flexGrow: 1,
      //     color: colors.neutralSwatch.main[10],
      //     textAlign: 'left',

      //   }}
      // >
      //   {comment.content.split(' ').slice(3).join(' ')}
      // </Typography>
      // </Box>
    );
  };

  const WyrDetailButton: React.FC<{
    listPostComments: ListPostComments;
  }> = ({ listPostComments }) => {
    return (
      <Link
        href={constructPath(routes.c.would_you_rather.detail._home, {
          options: {
            qid: wyrPost.postId,
          },
          searchParams: {
            tabId: param.get('tabId') || '0',
          },
        })}
      >
        <Button // go to all comments
          variant="text"
          sx={{
            color: colors.primarySwatch.main[40],
            paddingY: '4px',
            textAlign: 'left',
          }}
          startIcon={<MessageSquare size={15} />}
        >
          <Typography
            variant="labelLarge"
            sx={{
              transform: 'translateY(2px)',
            }}
          >
            {(listPostComments.topLevelCommentCount || 0) > 0
              ? `All ${listPostComments.topLevelCommentCount} comments`
              : 'Leave a comment'}
          </Typography>
        </Button>
      </Link>
    );
  };

  return (
    <Box // comment section
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {comments.length > 0 &&
        comments.slice(0, 1).map((comment, index) => {
          return <CommentRow key={index} comment={comment} />;
        })}
      <Box sx={{ paddingTop: '4px' }} aria-label="spacer" />
      {listPostComments && (
        <WyrDetailButton listPostComments={listPostComments} />
      )}
    </Box>
  );
};
