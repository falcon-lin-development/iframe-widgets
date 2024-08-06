import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: SessionState;
};

type SessionState = {
  sessionId: string;
  utmData: Record<string, any>;
};

const initialState = {
  value: {
    sessionId: '',
    utmData: {},
  } as SessionState,
} as InitialState;

export const sessionSlice = createSlice({
  name: 'sessionSlice',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.value.sessionId = action.payload;
    },
    setUtmData: (state, action: PayloadAction<Record<string, any>>) => {
      state.value.utmData = action.payload;
    },
    // clearState: (state) => {
    //     state.value = initialState.value as SessionState;
    // },
  },
});

export const {
  setSessionId,
  setUtmData,
  // clearState
} = sessionSlice.actions;
export default sessionSlice.reducer;
