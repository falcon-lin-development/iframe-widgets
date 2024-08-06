import { Dispatch } from '@reduxjs/toolkit';

import communitySlice, {
  clearState as clearCommunityState,
} from '../features/community/communitySlice';
import communityProfileSlice, {
  clearState as clearCommunityProfileState,
} from '../features/community/communityProfileSlice';
import communityQuestsSlice, {
  clearState as clearCommunityQuestsState,
} from '../features/community/communityQuestsSlice';
import communityQuestDetailSlice, {
  clearState as clearCommunityQuestDetailState,
} from '../features/community/communityQuestDetailSlice';
import communityInboxsSlice, {
  clearState as clearCommunityInboxsState,
} from '../features/community/communityInboxsSlice';
import communityStickersSlice, {
  clearState as clearCommunityStickersState,
} from '../features/community/communityStickersSlice';
import communityDataStoreSlice, {
  clearState as clearCommunityDataStoreState,
} from '../features/community/communityDataStoreSlice';

export const reducerSettings = {
  communitySlice,
  communityProfileSlice,
  communityQuestsSlice,
  communityQuestDetailSlice,
  communityInboxsSlice,
  communityDataStoreSlice,
  communityStickersSlice,
};

/**
 * @dev Dispatch is used here to avoid circular dependencies
 * @param dispatch
 */
export const clearState = (dispatch: Dispatch) => {
  dispatch(clearCommunityState());
  dispatch(clearCommunityProfileState());
  dispatch(clearCommunityQuestsState());
  dispatch(clearCommunityQuestDetailState());
  dispatch(clearCommunityInboxsState());
  dispatch(clearCommunityStickersState());
  dispatch(clearCommunityDataStoreState());
};
