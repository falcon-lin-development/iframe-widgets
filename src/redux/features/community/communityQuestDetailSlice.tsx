import { QuestDetail } from '@/data/services/fetchCommunityQuestDetailSerivce';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: QuestDetail;
};

const initialState = {
  value: {} as QuestDetail,
} as InitialState;

export const communityQuestDetail = createSlice({
  name: 'communityQuestDetail',
  initialState,
  reducers: {
    setCommunityQuestDetail: (state, action: PayloadAction<QuestDetail>) => {
      state.value = action.payload;
    },
    clearState: (state) => {
      state.value = initialState.value as QuestDetail;
    },
  },
});

export const { setCommunityQuestDetail, clearState } =
  communityQuestDetail.actions;
export default communityQuestDetail.reducer;
