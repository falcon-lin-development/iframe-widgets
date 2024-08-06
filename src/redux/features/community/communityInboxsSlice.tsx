import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityInboxMessagesList } from '@/data/repositaries/CommunityInboxRepo';

type InitialState = {
  value: CommunityInboxMessagesList;
};

const initialState = {
  value: {} as CommunityInboxMessagesList,
} as InitialState;

export const communityInbox = createSlice({
  name: 'communityInbox',
  initialState,
  reducers: {
    setCommunityInboxs: (
      state,
      action: PayloadAction<CommunityInboxMessagesList>,
    ) => {
      state.value = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const msg = state.value.results.find(
        (inbox) => inbox.msg_id === action.payload,
      );
      if (msg) {
        msg.is_read = true;
      }
    },
    clearState: (state) => {
      state.value = initialState.value as CommunityInboxMessagesList;
    },
  },
});

export const { setCommunityInboxs, clearState, markAsRead } =
  communityInbox.actions;
export default communityInbox.reducer;
