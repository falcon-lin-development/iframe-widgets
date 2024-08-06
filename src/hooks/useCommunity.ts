import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setCommunity } from '@/redux/features/community/communitySlice';
import {
  Community,
  fetchCommunityData,
} from '@/data/services/fetchCommunityService';

import { useState, useEffect, useMemo } from 'react';

export const useCommunityId = {
  communityId: '1770071e-0000-0000-0000-1770071e7000',
};
const useCommunity = (communityPathId: string = 'mootiez') => {
  const dispatch = useAppDispatch();
  const community: Community = useAppSelector(
    (state) => state.communitySlice.value,
  );

  const _refreshCommunityData = async (communityPathId: string) => {
    dispatch(setCommunity(await fetchCommunityData(communityPathId)));
  };

  const isInit = useMemo(() => {
    return community.community_id ? true : false;
  }, [community.community_id]);

  useEffect(() => {
    // refresh the community data when the path changes
    const _saveRefresh = async () => {
      if (community.path_id !== communityPathId) {
        // console.log('reload community data:', communityPathId, community);
        await _refreshCommunityData(communityPathId);
      }
    };
    _saveRefresh();
  }, [communityPathId, community.community_id]);

  return {
    community,
    communityPathId,
    state: {
      community,
      communityPathId,
      isCommunityInit: isInit,
    },
  };
};

export default useCommunity;
