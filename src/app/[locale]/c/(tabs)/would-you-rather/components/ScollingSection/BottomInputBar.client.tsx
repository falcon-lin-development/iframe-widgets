import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { SendHorizonal, SkipForward } from 'lucide-react';
import { LikeButton } from '../LikeButton';

// hooks
import { GameStateHook, INGAMESTATE } from '../gameScene/useGameState';
import { LikeHook, useLikeHook } from '../gameScene/useLikeHook';

// constants
import colors from '@/styles/colors.config';
import { WyrPost } from '../../graphql/models/WyrPost';
import {
  SelectionOption,
  SectionsBottomModalSheet,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';

type BottomInputBarProps = {
  // nextQuestion?: (skipReason?: string) => void;
  // likeHook: LikeHook;
  gameContext: GameStateHook;
  wyrPost: WyrPost;
};

const _btnState = ({ gameContext, wyrPost }: BottomInputBarProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (ee: React.FormEvent<HTMLFormElement>) => {
    ee.preventDefault();
    gameContext.actions.addComment(message, wyrPost.postId, wyrPost.postType);
    setMessage('');
  };
  return {
    message,
    setMessage,
    handleSendMessage,
    sendChatMessageState: gameContext.state.addCommentState,
  };
};

const BottomInputBar: React.FC<BottomInputBarProps> = ({
  // nextQuestion,
  gameContext,
  wyrPost,
}) => {
  const { message, setMessage, handleSendMessage, sendChatMessageState } =
    _btnState({
      gameContext,
      wyrPost,
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
          placeholder="leave a comment"
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

        <LikeBtnGroup
          key={'like' + wyrPost.postId}
          wyrPost={wyrPost}
          gameContext={gameContext}
        />
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
