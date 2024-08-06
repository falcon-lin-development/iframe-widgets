import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getSurvey, Survey } from '@/data/repositaries/SurveyJsRepo';
import { DataState } from '@/redux/model';

type InitialState = {
  value: SurveyJsState;
  state: DataState;
  error: string | null;
};

type SurveyJsState = {
  survey: Survey;
};

const initialState = {
  value: {
    survey: {},
  } as SurveyJsState,
  state: DataState.IDLE,
  error: null,
} as InitialState;

export const fetchSurveyJsThunk = createAsyncThunk(
  'surveyJsSlice/fetchSurveyJs',
  async ({ formId }: { formId: string }, { rejectWithValue }) => {
    try {
      return await getSurvey({
        formId: formId,
      });
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to fetch survey',
      );
    }
  },
);

export const surveyJsSlice = createSlice({
  name: 'surveyJsSlice',
  initialState,
  reducers: {
    setSurvey: (state, action: PayloadAction<Survey>) => {
      state.value.survey = action.payload;
      state.state = DataState.SUCCESS;
    },
    clearState: (state) => {
      state.value = initialState.value as SurveyJsState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyJsThunk.pending, (state) => {
        state.state = DataState.LOADING;
      })
      .addCase(fetchSurveyJsThunk.fulfilled, (state, action) => {
        state.value.survey = action.payload;
        state.state = DataState.SUCCESS;
      })
      .addCase(fetchSurveyJsThunk.rejected, (state, action) => {
        state.state = DataState.ERROR;
        state.error = action.payload as string;
      });
  },
});

export const { setSurvey, clearState } = surveyJsSlice.actions;
export default surveyJsSlice.reducer;
