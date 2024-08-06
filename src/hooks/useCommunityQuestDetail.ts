import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  QuestDetail,
  fetchCommunityQuestDetailParams,
  fetchCommunityQuestDetailSerivce,
} from '@/data/services/fetchCommunityQuestDetailSerivce';
import { Community } from '@/data/services/fetchCommunityService';
import { useEffect } from 'react';
import { setCommunityQuestDetail } from '@/redux/features/community/communityQuestDetailSlice';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

const useCommunityQuestDetail = (community: Community, questId: string) => {
  const dispatch = useAppDispatch();
  const communityQuestDetail: QuestDetail = useAppSelector(
    (state) => state.communityQuestDetailSlice.value,
  );
  const {
    utils: { getBearerToken },
  } = useDGAuth();

  const _refreshCommunityQuestDetailData = async ({
    communityId,
    questId,
  }: {
    communityId: string;
    questId: string;
  }) => {
    dispatch(
      setCommunityQuestDetail(
        await fetchCommunityQuestDetailSerivce({
          communityId: communityId,
          questId: questId,
          accessToken: (await getBearerToken()).jwtToken,
        } as fetchCommunityQuestDetailParams),
      ),
    );
  };

  useEffect(() => {
    const _saveRefresh = async () => {
      if (
        community.community_id &&
        questId !== communityQuestDetail?.quest?.quest_id
      ) {
        await _refreshCommunityQuestDetailData({
          communityId: community.community_id,
          questId: questId,
        });
      }
    };
    _saveRefresh();
  }, [questId]);

  return { communityQuestDetail };
};

export default useCommunityQuestDetail;
