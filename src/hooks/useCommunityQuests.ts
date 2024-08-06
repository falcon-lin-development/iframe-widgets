import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setCommunityQuests } from '@/redux/features/community/communityQuestsSlice';
import { Community } from '@/data/services/fetchCommunityService';
import {
  fetchCommunityQuestsService,
  fetchCommunityQuestsParams,
  QuestList,
} from '@/data/services/fetchCommunityQuestsService';
import { useEffect } from 'react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

const useCommunityQuests = (community: Community) => {
  const dispatch = useAppDispatch();
  const communityQuests: QuestList = useAppSelector(
    (state) => state.communityQuestsSlice.value,
  );

  const {
    utils: { getBearerToken },
  } = useDGAuth();

  const _refreshCommunityQuestsData = async ({
    communityId,
  }: {
    communityId: string;
  }) => {
    dispatch(
      setCommunityQuests(
        await fetchCommunityQuestsService({
          communityId: communityId,
          accessToken: (await getBearerToken()).jwtToken,
          communityQuests: communityQuests,
        } as fetchCommunityQuestsParams),
      ),
    );
  };

  const loadMoreQuests = async () => {
    if (community.community_id) {
      dispatch(
        setCommunityQuests(
          await fetchCommunityQuestsService({
            communityId: community.community_id,
            accessToken: (await getBearerToken()).jwtToken,
            communityQuests: communityQuests,
          } as fetchCommunityQuestsParams),
        ),
      );
    }
  };

  useEffect(() => {
    const _saveRefresh = async () => {
      if (community.community_id && !communityQuests.count) {
        console.log('communityQuest:', communityQuests.count);
        await _refreshCommunityQuestsData({
          communityId: community.community_id,
        });
      }
    };
    _saveRefresh();
  }, [community]);

  return { communityQuests, loadMoreQuests };
};

export default useCommunityQuests;
