import { Community } from '@/data/services/fetchCommunityService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: Community;
};

const initialState = {
  value: {} as Community,
} as InitialState;

export const community = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunity: (state, action: PayloadAction<Community>) => {
      state.value = action.payload;
    },
    clearState: (state) => {
      state.value = initialState.value as Community;
    },
  },
});

export const { setCommunity, clearState } = community.actions;
export default community.reducer;
