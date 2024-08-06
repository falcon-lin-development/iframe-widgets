import { useChatRoom } from '../bot/guest/[chatId]/ChatRoomContextProvider';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { SendHorizonal } from 'lucide-react';
import colors from '@/styles/colors.config';

const RoomInputField: React.FC = () => {
  const {
    state: {
      joinChatbotRoomState,
      roomSubscriptionState,
      sendChatMessageState,
    },
    utils: { sendChatMessage },
  } = useChatRoom();
  const [message, setMessage] = useState('');

  const handleSendMessage = (ee: React.FormEvent<HTMLFormElement>) => {
    ee.preventDefault();
    sendChatMessage({ text: message });
    setMessage('');
  };

  // sendChatMessageState.input state
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px', // padding around the form
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
          InputProps={{
            // startAdornment: (
            //   <InputAdornment position="start">
            //     <EmailOutlinedIcon />
            //   </InputAdornment>
            // ),

            sx: {
              borderWidth: '0',
              borderRadius: '9999px', // rounded corners
              bgcolor: sendChatMessageState.fetching
                ? colors.neutralSwatch.main[98]
                : colors.neutralSwatch.main[95],
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
      </Box>
    </>
  );
};

export default RoomInputField;
