// POST /api/v1/client/community-profile/image-upload
// GET /api/v1/client/community-profile/image-upload-list
// POST /api/v1/client/community-profile/delete-image-upload

import apiService from '../base';
import axios, { AxiosResponse } from 'axios';

export enum CommunityImageFileFolder {
  stickers = 'stickers',
  avatar = 'avatar',
}

export type CommunityImageFile = {
  id: string;
  url: string;
  last_modified?: number;
};

export type CommunityImageFileList = CommunityImageFile[];

export type CommunityImageFileUploadParam = {
  accessToken: string;
  communityId: string;
  folder: string;
  file: File;
};

export const uploadCommunityImageFile = async (
  param: CommunityImageFileUploadParam,
): Promise<CommunityImageFile> => {
  try {
    const formData = new FormData();
    formData.append('file', param.file);
    formData.append('folder', param.folder);
    formData.append('community_id', param.communityId);
    const response: AxiosResponse = await apiService.post(
      '/api/v1/client/community-profile/image-upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${param.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('Axios error:', e.response);
    } else {
      console.error('Unexpected error:', e);
    }
    throw e;
  }
};

export const fetchCommunityImageFileList = async ({
  accessToken,
  folder,
  communityId,
}: {
  accessToken: string;
  folder: string;
  communityId: string;
}): Promise<CommunityImageFileList> => {
  try {
    const response: AxiosResponse = await apiService.get(
      '/api/v1/client/community-profile/image-upload-list',
      {
        params: {
          folder,
          community_id: communityId,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('Axios error:', e.response);
    } else {
      console.error('Unexpected error:', e);
    }
    throw e;
  }
};

export const deleteCommunityImageFile = async ({
  accessToken,
  communityId,
  folder,
  fileId,
}: {
  accessToken: string;
  communityId: string;
  folder: string;
  fileId: string;
}): Promise<boolean> => {
  try {
    const response: AxiosResponse = await apiService.post(
      '/api/v1/client/community-profile/delete-image-upload',
      {
        community_id: communityId,
        id: fileId,
        folder,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.status === 200;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('Axios error:', e.response);
    } else {
      console.error('Unexpected error:', e);
    }
    throw e;
  }
};
