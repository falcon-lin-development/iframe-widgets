import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MBTIData {
  i?: number | string;
  e?: number | string;
  n?: number | string;
  s?: number | string;
  t?: number | string;
  f?: number | string;
  j?: number | string;
  p?: number | string;
  ismale?: number | string;
  referral_code?: string;
  referralcode?: string;
  http_referer?: string;
  httpreferer?: string;
  channel?: string;
}

export interface MBTIFromFriend {
  i: string;
  e: string;
  n: string;
  s: string;
  t: string;
  f: string;
  j: string;
  p: string;
  score: string;
  friend_name: string;
}

export const isFriedMBTIDataValid = (mbtiData: MBTIFromFriend): boolean => {
  if (!mbtiData) {
    console.log('mbtiData is not valid');
    return false;
  }
  if (Object.keys(mbtiData).length === 0) {
    console.log('object is empty');
    return false;
  }
  if (!mbtiData.i) {
    console.log('i is not valid');
    return false;
  }
  if (!mbtiData.e) {
    console.log('e is not valid');
    return false;
  }
  if (!mbtiData.n) {
    console.log('n is not valid');
    return false;
  }
  if (!mbtiData.s) {
    console.log('s is not valid');
    return false;
  }
  if (!mbtiData.t) {
    console.log('t is not valid');
    return false;
  }
  if (!mbtiData.f) {
    console.log('f is not valid');
    return false;
  }
  if (!mbtiData.j) {
    console.log('j is not valid');
    return false;
  }
  if (!mbtiData.p) {
    console.log('p is not valid');
    return false;
  }
  if (!mbtiData.score) {
    console.log('score is not valid');
    return false;
  }
  if (!mbtiData.friend_name) {
    console.log('friend_name is not valid');
    return false;
  }
  return true;
};

export const isMBTIDataValid = (mbtiData: MBTIData): boolean => {
  if (!mbtiData) {
    console.log('mbtiData is not valid');
    return false;
  }
  if (Object.keys(mbtiData).length === 0) {
    console.log('object is empty');
    return false;
  }
  if (!mbtiData.i) {
    console.log('i is not valid');
    return false;
  }
  if (!mbtiData.e) {
    console.log('e is not valid');
    return false;
  }
  if (!mbtiData.n) {
    console.log('n is not valid');
    return false;
  }
  if (!mbtiData.s) {
    console.log('s is not valid');
    return false;
  }
  if (!mbtiData.t) {
    console.log('t is not valid');
    return false;
  }
  if (!mbtiData.f) {
    console.log('f is not valid');
    return false;
  }
  if (!mbtiData.j) {
    console.log('j is not valid');
    return false;
  }
  if (!mbtiData.p) {
    console.log('p is not valid');
    return false;
  }
  return true;
};

export const getType = (mbtiData: MBTIData | MBTIFromFriend): string => {
  if (
    !isMBTIDataValid(mbtiData) &&
    !isFriedMBTIDataValid(mbtiData as MBTIFromFriend)
  ) {
    return '';
  }
  const { i, e, n, s, t, f, j, p } = mbtiData;
  return `${i! > e! ? 'I' : 'E'}${n! > s! ? 'N' : 'S'}${t! > f! ? 'T' : 'F'}${
    j! > p! ? 'J' : 'P'
  }`;
};

export const getGender = (mbtiData: MBTIData): string => {
  if (!isMBTIDataValid(mbtiData)) {
    return '';
  }
  if (mbtiData.ismale === -1 || mbtiData.ismale === '-1') {
    return 'f';
  } else if (mbtiData.ismale === 1 || mbtiData.ismale === '1') {
    return 'm';
  } else {
    return '';
  }
};

export const calculateDelusionIndex = (
  mbtiData: MBTIData,
  mbtiFromFriend: MBTIFromFriend,
) => {
  /**
   * # Delusion Index
      1. For any pair, if doesn't match, then it's 25% (e.g., you say you are I, but friend says you are E)
      2. But if agree, then look at magnitude
        - Total absolute difference of the pair (e.g., I vs E), multiplied by 3.
          - e.g., Subject scores: I:2 and E:1 (i.e., is I), Friend 1 scores I:7.5 and E:0
            - difference in I = 5.5
            - difference in E = 1
            - Total difference = 6.5
            - Score (I vs E) = 6.5 * 3 = 19.5
   */
  const myType = getType(mbtiData);
  const friendType = getType(mbtiFromFriend);

  let delusionIndex = 0;
  if (myType[0] !== friendType[0]) {
    delusionIndex += 25;
  } else {
    delusionIndex +=
      (Math.abs(Number(mbtiData.i) - Number(mbtiFromFriend.i)) +
        Math.abs(Number(mbtiData.e) - Number(mbtiFromFriend.e))) *
      3;
  }

  if (myType[1] !== friendType[1]) {
    delusionIndex += 25;
  } else {
    delusionIndex +=
      (Math.abs(Number(mbtiData.n) - Number(mbtiFromFriend.n)) +
        Math.abs(Number(mbtiData.s) - Number(mbtiFromFriend.s))) *
      3;
  }

  if (myType[2] !== friendType[2]) {
    delusionIndex += 25;
  } else {
    delusionIndex +=
      (Math.abs(Number(mbtiData.t) - Number(mbtiFromFriend.t)) +
        Math.abs(Number(mbtiData.f) - Number(mbtiFromFriend.f))) *
      3;
  }

  if (myType[3] !== friendType[3]) {
    delusionIndex += 25;
  } else {
    delusionIndex +=
      Math.abs(Number(mbtiData.j) - Number(mbtiFromFriend.j)) +
      Math.abs(Number(mbtiData.p) - Number(mbtiFromFriend.p)) * 3;
  }
  return delusionIndex;
};

export enum MBTIBreakdown {
  I = 'Introverted',
  E = 'Extraverted',
  N = 'Intuitive',
  S = 'Sensing',
  T = 'Thinking',
  F = 'Feeling',
  J = 'Judging',
  P = 'Perceiving',
}
export const stringToBreakDown = (
  s: 'I' | 'E' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P',
): MBTIBreakdown => {
  switch (s) {
    case 'I':
      return MBTIBreakdown.I;
    case 'E':
      return MBTIBreakdown.E;
    case 'N':
      return MBTIBreakdown.N;
    case 'S':
      return MBTIBreakdown.S;
    case 'T':
      return MBTIBreakdown.T;
    case 'F':
      return MBTIBreakdown.F;
    case 'J':
      return MBTIBreakdown.J;
    case 'P':
      return MBTIBreakdown.P;
  }
};

type InitialState = {
  value: MBTIData;
};

const initialState = {
  value: {} as MBTIData,
} as InitialState;

export const mbti = createSlice({
  name: 'mbti',
  initialState,
  reducers: {
    setMBTI: (state, action: PayloadAction<MBTIData>) => {
      state.value = action.payload;
    },
    clearState: (state) => {
      state.value = initialState.value as MBTIData;
    },
  },
});

export const { setMBTI, clearState } = mbti.actions;
export default mbti.reducer;
