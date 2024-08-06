import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCommunityImageFileList,
  CommunityImageFileList,
  CommunityImageFileFolder,
  // CommunityImageFile,
} from '@/data/repositaries/CommunityImageFileRepo';
import { DataState } from '@/redux/model';

type InitialState = {
  value: CommunityImageFileList;
  state: DataState;
  error: string | null;
};

const initialState = {
  value: [] as CommunityImageFileList,
  state: DataState.IDLE,
  error: null,
} as InitialState;

export const fetchStickersThunk = createAsyncThunk(
  'communityStickersSlice/fetchStickers',
  async (
    { accessToken, communityId }: { accessToken: string; communityId: string },
    { rejectWithValue },
  ) => {
    try {
      return await fetchCommunityImageFileList({
        accessToken,
        folder: CommunityImageFileFolder.stickers,
        communityId,
      });
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to fetch stickers',
      );
    }
  },
);

export const communityStickersSlice = createSlice({
  name: 'communityStickersSlice',
  initialState,
  reducers: {
    setStickers: (state, action: PayloadAction<CommunityImageFileList>) => {
      state.value = action.payload;
      state.state = DataState.SUCCESS;
    },
    clearState: (state) => {
      state.value = initialState.value as CommunityImageFileList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStickersThunk.pending, (state) => {
        state.state = DataState.LOADING;
      })
      .addCase(fetchStickersThunk.fulfilled, (state, action) => {
        state.value = action.payload;
        state.state = DataState.SUCCESS;
      })
      .addCase(fetchStickersThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.state = DataState.ERROR;
      });
  },
});

export const { setStickers, clearState } = communityStickersSlice.actions;
export default communityStickersSlice.reducer;
