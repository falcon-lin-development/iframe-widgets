import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IsGeneratedMootiezState {
  isGeneratedMootiez: boolean;
  // isGeneratingMootiez: boolean;
}

type InitialState = {
  value: IsGeneratedMootiezState;
};
const initialState = {
  value: {} as IsGeneratedMootiezState,
} as InitialState;

export const isGeneratedMootiezSlice = createSlice({
  name: 'isGeneratedMootiez',
  initialState,
  reducers: {
    setIsGeneratedMootiez: (state, action: PayloadAction<boolean>) => {
      state.value.isGeneratedMootiez = action.payload;
    },
    // setIsGeneratingMootiez: (state, action: PayloadAction<boolean>) => {
    //     state.value.isGeneratingMootiez = action.payload;
    // },
    clearState: (state) => {
      state.value = initialState.value as IsGeneratedMootiezState;
    },
  },
});

export const {
  setIsGeneratedMootiez,
  // setIsGeneratingMootiez,
  clearState,
} = isGeneratedMootiezSlice.actions;
export default isGeneratedMootiezSlice.reducer;
