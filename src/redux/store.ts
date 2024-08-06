import {
  configureStore,
  combineReducers,
  EnhancedStore,
} from '@reduxjs/toolkit';
import { storage as localStorage, sessionStorage } from './storages';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'js-cookie';
import {
  persistReducer,
  persistStore,
  Persistor,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import authSlice, {
  clearState as clearAuthState,
} from '@/redux/features/authSlice';
import {
  reducerSettings as communityReducerSettings,
  clearState as clearCommunityStates,
} from './store.configs/community.config';
import {
  reducerSettings as flowsReducerSettings,
  clearState as clearFlowsStates,
} from './store.configs/flows.config';

import mbtiSlice, {
  clearState as clearMbtiState,
} from './features/mbti/mbtiSlice';
import isGeneratedMootiezSlice, {
  clearState as clearIsGeneratedMootiezState,
} from './features/mbti/isGeneratedMootiezSlice';
import sessionSlice from './features/tracking/sessionSlice';
import surveyJsSlice, {
  clearState as clearSurveyJsState,
} from './features/surveyJs/surveyJsSlice';

const rootReducer = combineReducers({
  d: persistReducer(
    {
      key: `app-${process.env.ENV}-dummy`,
      storage: sessionStorage,
    },
    authSlice,
  ),
  authSlice,
  ...communityReducerSettings,
  ...flowsReducerSettings,

  isGeneratedMootiezSlice: persistReducer(
    {
      key: `app-${process.env.ENV}-isGeneratedMootiez`,
      storage: localStorage,
    },
    isGeneratedMootiezSlice,
  ),
  mbtiSlice: persistReducer(
    {
      key: `app-${process.env.ENV}-mbti`,
      storage: localStorage,
    },
    mbtiSlice,
  ),
  sessionSlice: persistReducer(
    {
      key: `app-${process.env.ENV}-session`,
      storage: sessionStorage,
    },
    sessionSlice,
  ),
  surveyJsSlice: persistReducer(
    {
      key: `app-${process.env.ENV}-surveyJs`,
      storage: sessionStorage,
    },
    surveyJsSlice,
  ),
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  (store as EnhancedStore & { __persistor: Persistor }).__persistor =
    persistStore(store);

  return store;
};

// Reset all reducers to their initial state
export const resetAllState = () => (dispatch: AppDispatch) => {
  dispatch(clearAuthState());
  clearCommunityStates(dispatch);
  clearFlowsStates(dispatch);
  dispatch(clearMbtiState());
  dispatch(clearIsGeneratedMootiezState());
  dispatch(clearSurveyJsState());
  // Purge the persistor
  const persistor = (makeStore() as EnhancedStore & { __persistor: Persistor })
    .__persistor;
  persistor.purge();
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// =================================================================================================
// const cookiePersistConfig = {
//   key: 'reduxPersist-cookieStorage',
//   storage: new CookieStorage(Cookies, {
//     expiration: {
//       default: 365 * 86400, // Expires in one year
//       // Add security options here...
//     },
//   }),
// };
