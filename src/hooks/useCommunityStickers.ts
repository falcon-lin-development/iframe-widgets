import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setStickers,
  fetchStickersThunk,
} from '@/redux/features/community/communityStickersSlice';
import { CommunityImageFile } from '@/data/repositaries/CommunityImageFileRepo';

import { useEffect, useMemo } from 'react';
import { DataState } from '@/redux/model';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { Community } from '@/data/services/fetchCommunityService';

export const useCommunityStickers = (community: Community) => {
  const dispatch = useAppDispatch();
  const {
    utils: { getBearerToken },
  } = useDGAuth();

  const stickers = useAppSelector(
    (state) => state.communityStickersSlice.value,
  );
  const stickersState = useAppSelector(
    (state) => state.communityStickersSlice.state,
  );

  const refreshStickers = async () => {
    const accessToken = (await getBearerToken()).jwtToken;
    dispatch(
      fetchStickersThunk({ accessToken, communityId: community.community_id }),
    );
  };

  // memo states
  const isInit = useMemo(() => {
    return (
      stickersState !== DataState.LOADING && // it's not loading
      stickersState !== DataState.IDLE
    ); // it's not idle
  }, [stickersState]);

  const isError = useMemo(() => {
    return isInit && stickersState === DataState.ERROR; // it's not valid
  }, [isInit]);

  useEffect(() => {
    if (!isInit && community.community_id) {
      refreshStickers();
    }
  }, [stickersState, community.community_id]);

  return {
    state: {
      isStickersInit: isInit,
      isStickersError: isError,
      stickers,
      stickersState,
    },
    actions: {
      refreshStickers,
    },
  };
};

export default useCommunityStickers;
