import { Dispatch } from '@reduxjs/toolkit';

import onBoardingSlice, {
  clearState as clearOnBoardingState,
} from '../features/flows/onBoardingSlice';

export const reducerSettings = {
  onBoardingSlice,
};

/**
 * @dev Dispatch is used here to avoid circular dependencies
 * @param dispatch
 */
export const clearState = (dispatch: Dispatch) => {
  dispatch(clearOnBoardingState());
};
