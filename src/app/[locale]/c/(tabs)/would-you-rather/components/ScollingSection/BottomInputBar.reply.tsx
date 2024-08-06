import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { SendHorizonal, SkipForward } from 'lucide-react';
import { LikeButton } from '../LikeButton';

// hooks
import { GameStateHook, INGAMESTATE } from '../gameScene/useGameState';
import { GameStateContextType } from '../../[qid]/GameContextByIdProvider';
import { LikeHook, useLikeHook } from '../gameScene/useLikeHook';

// constants
import { WyrPost } from '../../graphql/models/WyrPost';
import { PostComment } from '../../graphql/models/WyrPostComment';
import colors from '@/styles/colors.config';
import {
  SelectionOption,
  SectionsBottomModalSheet,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import { AnyVariables, OperationResult, UseMutationState } from 'urql';
import { addChildComment } from '../../graphql/models/addChildComment';

type BottomInputBarProps = {
  comment: PostComment;
  sendMessageState: UseMutationState<
    {
      replyComment: addChildComment;
    },
    AnyVariables
  >;
  sendMessage: (content: string) => void;
  sx?: SxProps<Theme>;
  // wyrPost: WyrPost;
};

const _btnState = ({
  // gameContext,
  // wyrPost,
  comment,
  sendMessageState,
  sendMessage,
}: BottomInputBarProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (ee: React.FormEvent<HTMLFormElement>) => {
    ee.preventDefault();
    sendMessage(message);
    setMessage('');
  };
  return {
    message,
    setMessage,
    handleSendMessage,
    sendChatMessageState: sendMessageState,
  };
};

const BottomInputBar: React.FC<BottomInputBarProps> = ({
  // nextQuestion,
  comment,
  sendMessageState,
  sendMessage,
  sx,
}) => {
  const { message, setMessage, handleSendMessage, sendChatMessageState } =
    _btnState({
      comment,
      sendMessageState,
      sendMessage,
    });

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '12px 16px', // padding around the form
          ...sx,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          size="small"
          hiddenLabel={true}
          // label="Message"
          variant="outlined"
          fullWidth
          value={message}
          onChange={(ee) => setMessage(ee.target.value)}
          disabled={sendChatMessageState.fetching}
          autoFocus // Automatically focus this input
          placeholder="leave a response"
          InputProps={{
            sx: {
              borderWidth: '0',
              borderRadius: '9999px', // rounded corners
              bgcolor: colors.neutralSwatch.main[95],
              '& fieldset': { border: 'none' },
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" disabled={!message.trim()}>
                  <SendHorizonal
                    color={
                      sendChatMessageState.fetching
                        ? colors.neutralSwatch.main[70]
                        : colors.neutralSwatch.main[30]
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ paddingRight: '8px' }} aria-label="spacer"></Box>

        {/* <LikeBtnGroup
          key={'like' + comment.commentId}
          wyrPost={wyrPost}
          gameContext={gameContext}
        /> */}
      </Box>
    </>
  );
};

export default BottomInputBar;

// other components

const LikeBtnGroup: React.FC<{
  wyrPost: WyrPost;
  gameContext: GameStateHook;
}> = ({ wyrPost, gameContext }) => {
  const likeHook = useLikeHook({
    isInitiallyLiked: wyrPost.userInteraction?.is_liked || false,
    originalLikeCount: wyrPost.viewStats.like_count,
    toggleLike: gameContext.actions.toggleLikeWyrPost,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2px',
        minWidth: '40px',
      }}
    >
      <Box
        sx={{
          padding: '0px 0px',
          color: colors.neutralSwatch.main[30],
        }}
      >
        <LikeButton
          isLiked={likeHook.state.isLiked}
          onClick={() => {
            likeHook.actions.toggleLike();
          }}
          size={22}
        />
      </Box>
      <Typography
        variant="bodySmall"
        sx={{
          color: colors.neutralSwatch.main[30],
        }}
      >
        {likeHook.state.formatedCounts}
      </Typography>
    </Box>
  );
};
