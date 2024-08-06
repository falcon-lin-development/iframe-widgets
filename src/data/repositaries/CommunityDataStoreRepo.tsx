// GET /api/v1/client/community-profile/community-datastore
// POST /api/v1/client/community-profile/update-community-datastore
// POST /api/v1/client/community-profile/remove-community-datastore

import apiService from '../base';
import axios, { AxiosResponse } from 'axios';

export const getCommunityDataStore: (props: {
  communityId: string;
  accessToken: string;
}) => Promise<Record<string, any>> = async ({ communityId, accessToken }) => {
  console.log('getting community data store api');
  try {
    const response: AxiosResponse = await apiService.get(
      `/api/v1/client/community-profile/community-datastore?community_id=${communityId.trim()}`,
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const updateCommunityDataStore: (props: {
  communityId: string;
  accessToken: string;
  userStoredData: Record<string, any>;
}) => Promise<Record<string, any>> = async ({
  communityId,
  accessToken,
  userStoredData,
}) => {
  console.log('updating community data store api');
  try {
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/update-community-datastore`,
      {
        community_id: communityId.trim(),
        data: userStoredData,
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const removeCommunityDataStore: (props: {
  communityId: string;
  accessToken: string;
  keys: Array<string>;
}) => Promise<Record<string, any>> = async ({
  communityId,
  accessToken,
  keys,
}) => {
  console.log('removing community data store api');
  try {
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/community-profile/remove-community-datastore`,
      {
        community_id: communityId,
        keys: keys,
      },
      {
        headers: {
          authentication: 'Bearer ' + accessToken,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
