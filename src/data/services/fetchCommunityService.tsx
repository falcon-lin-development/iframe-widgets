import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
interface CommunityLink {
  link_type: string;
  url: string;
}

interface Community {
  banner_url: string;
  community_id: string;
  created_at: number;
  created_by: string;
  entity_id: string;
  is_nsfw: boolean;
  links: CommunityLink[];
  login_img_url: string;
  logo_url: string;
  name: string;
  path_id: string;
  profile: string;
  profile_last_updated: number;
  status: string;
  status_last_updated: number;
  tags: string[];
  updated_at: number;
  updated_by: string;
}

// Example usage in an API call (fetch)
const defaultCommunity: Community = {
  banner_url:
    'https://static.wixstatic.com/media/1f82e2_6ee9fdf33f1b43b5bdc248c6648b978a~mv2.png/v1/fill/w_218,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Primary%20logo_Horizontal.png',
  community_id: '12345678-1234-1234-56789012345678',
  created_at: 1623141592,
  created_by: '66667777-1234-1234-00000012345678',
  entity_id: '12345678-1234-1234-56789012345678',
  is_nsfw: false,
  links: [
    {
      link_type: 'website',
      url: 'https://dev.to',
    },
  ],
  login_img_url:
    'https://i.pravatar.cc/300?u=12345678-1234-1234-56789012345678',
  logo_url:
    'https://static.wixstatic.com/media/1f82e2_6ee9fdf33f1b43b5bdc248c6648b978a~mv2.png/v1/fill/w_218,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Primary%20logo_Horizontal.png',
  name: 'Dev Community',
  path_id: 'dev',
  profile: '',
  profile_last_updated: 1623141592,
  status: 'normal',
  status_last_updated: 1623141592,
  tags: ['dev', 'builder'],
  updated_at: 1623141592,
  updated_by: '66667777-1234-1234-00000012345678',
};

const fetchCommunityData = async (
  communityPathId: string,
): Promise<Community> => {
  try {
    const response: AxiosResponse<Community> = await apiService.get(
      `/api/v1/public/community`,
      {
        params: {
          path_id: communityPathId,
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
    return defaultCommunity;
    // throw error;
  }
};

export { fetchCommunityData };
export type { Community, CommunityLink };
