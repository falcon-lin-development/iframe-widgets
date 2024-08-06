// import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import {
  PersonaCommunityProfile,
  GET_PERSONA_COMMUNITY_PROFILE,
  CommunityProfileDataStore,
} from '@/data/graphql/models/PersonaCommunityProfile';
import { DataState } from '@/redux/model';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Client } from 'urql';
import { toCamelCase, toSnakeCase } from '@/utils/dataTransform';

type InitialState = {
  value: PersonaCommunityProfile;
  state: DataState;
  error: string | null;
};

const initialState = {
  value: {} as PersonaCommunityProfile,
  state: DataState.IDLE,
  error: null,
} as InitialState;

export const fetchCommunityProfileThunk = createAsyncThunk(
  'communityProfileSlice/fetchCommunityProfile',
  async (
    { qClient, communityId }: { qClient: Client; communityId: string },
    { rejectWithValue },
  ) => {
    try {
      /**
       * @dev use RestAPI a like call fror graph ql
       */
      const result = await qClient
        .query<{
          getPersonaCommunityProfile: PersonaCommunityProfile;
          getProfileDatastore: CommunityProfileDataStore;
        }>(GET_PERSONA_COMMUNITY_PROFILE, {
          communityId,
        })
        .toPromise(); // TODO: change this to get or create

      // check for errors
      if (result.error) {
        throw new Error(result.error.message);
      } else if (result.data?.getPersonaCommunityProfile.error) {
        throw new Error(result.data?.getPersonaCommunityProfile.message);
      }

      // process the data
      const output = {
        ...toSnakeCase(result.data?.getPersonaCommunityProfile),
        // ...toCamelCase(result.data?.getPersonaCommunityProfile),
      };
      output.persona_id = output?.persona?.persona_id || '-';
      output.data_store = result.data?.getProfileDatastore?.data;
      console.log('fetchCommunityProfileThunk', output);
      // return the data
      return output;
    } catch (error) {
      console.error('fetchCommunityProfileThunk', error);
      return rejectWithValue(
        (error as Error).message || 'Failed to fetch community profile',
      );
    }
  },
);

export const communityProfileSlice = createSlice({
  name: 'communityProfileSlice',
  initialState,
  reducers: {
    setCommunityProfile: (
      state,
      action: PayloadAction<PersonaCommunityProfile>,
    ) => {
      state.value = action.payload;
      state.state = DataState.SUCCESS;
    },
    clearState: (state) => {
      state.value = initialState.value as PersonaCommunityProfile;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityProfileThunk.pending, (state) => {
        state.state = DataState.LOADING;
      })
      .addCase(fetchCommunityProfileThunk.fulfilled, (state, action) => {
        state.value = action.payload!;
        state.state = DataState.SUCCESS;
      })
      .addCase(fetchCommunityProfileThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.state = DataState.ERROR;
      });
  },
});

export const { setCommunityProfile, clearState } =
  communityProfileSlice.actions;
export default communityProfileSlice.reducer;
