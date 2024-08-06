import { QuestList } from '@/data/services/fetchCommunityQuestsService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: QuestList;
};

const initialState = {
  value: {} as QuestList,
} as InitialState;

export const communityQuests = createSlice({
  name: 'communityQuests',
  initialState,
  reducers: {
    setCommunityQuests: (state, action: PayloadAction<QuestList>) => {
      state.value = action.payload;
    },
    clearState: (state) => {
      state.value = initialState.value as QuestList;
    },
  },
});

export const { setCommunityQuests, clearState } = communityQuests.actions;
export default communityQuests.reducer;
