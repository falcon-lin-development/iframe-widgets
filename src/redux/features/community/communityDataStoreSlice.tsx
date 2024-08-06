import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: Record<string, any>;
};

const initialState = {
  value: {},
} as InitialState;

export const communityDataStore = createSlice({
  name: 'communityDataStore',
  initialState,
  reducers: {
    setCommunityDataStore: (
      state,
      action: PayloadAction<Record<string, any>>,
    ) => {
      state.value = action.payload;
    },
    clearState: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { setCommunityDataStore, clearState } = communityDataStore.actions;
export default communityDataStore.reducer;
