/**
 * @file This file defines the onBoardingSlice which is a slice of the Redux store that contains the onBoarding state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  value: OnBoardingFlowState;
};

export type OnBoardingFlowState = {
  userName: string;
  userHandle: string;
  ei: 'E' | 'I' | null;
  sn: 'S' | 'N' | null;
  tf: 'T' | 'F' | null;
  jp: 'J' | 'P' | null;
  pronouns: string;
  bio: string;
  links: ProfileLinkInput[];
};

export type ProfileLinkInput = {
  title: string;
  url: string;
};

const initialState = {
  value: {
    userName: '',
    userHandle: '',
    ei: null,
    sn: null,
    tf: null,
    jp: null,
    pronouns: '',
    bio: '',
    links: [],
  } as OnBoardingFlowState,
} as InitialState;

export const onBoardingSlice = createSlice({
  name: 'onBoardingSlice',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.value.userName = action.payload;
    },
    setUserHandle: (state, action: PayloadAction<string>) => {
      state.value.userHandle = action.payload;
    },
    setEI: (state, action: PayloadAction<'E' | 'I'>) => {
      state.value.ei = action.payload;
    },
    setSN: (state, action: PayloadAction<'S' | 'N'>) => {
      state.value.sn = action.payload;
    },
    setTF: (state, action: PayloadAction<'T' | 'F'>) => {
      state.value.tf = action.payload;
    },
    setJP: (state, action: PayloadAction<'J' | 'P'>) => {
      state.value.jp = action.payload;
    },
    setPronouns: (state, action: PayloadAction<string>) => {
      state.value.pronouns = action.payload;
    },
    setBio: (state, action: PayloadAction<string>) => {
      state.value.bio = action.payload;
    },
    addLink: (state, action: PayloadAction<{ title: string; url: string }>) => {
      state.value.links.push(action.payload);
    },
    removeLinkByIndex: (state, action: PayloadAction<number>) => {
      state.value.links.splice(action.payload, 1);
    },
    setLinkByIndex: (
      state,
      action: PayloadAction<{ title: string; url: string; index: number }>,
    ) => {
      const { title, url, index } = action.payload;
      state.value.links[index] = {
        title,
        url,
      };
    },
    clearState: (state) => {
      state.value = initialState.value;
    },
  },
});

export const {
  setUserName,
  setUserHandle,
  setEI,
  setSN,
  setTF,
  setJP,
  setPronouns,
  setBio,
  addLink,
  removeLinkByIndex,
  setLinkByIndex,
  clearState,
} = onBoardingSlice.actions;
export default onBoardingSlice.reducer;
