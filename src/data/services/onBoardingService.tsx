/**
 * Make calls to local api
 */

import { OnBoardingFlowState } from '@/redux/features/flows/onBoardingSlice';
import axios from 'axios';

export const APP_API_ENDPOINT = '/api/create-public-profile';

export const onBoardingCreateProfile = async (
  data: OnBoardingFlowState,
  searchParams: Record<string, string>,
  authToken: string,
) => {
  try {
    console.log('onBoardingCreateProfile', data, searchParams);
    const result = await axios.post(
      APP_API_ENDPOINT,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: searchParams,
      },
    );
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
