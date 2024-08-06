import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setCommunityInboxs } from '@/redux/features/community/communityInboxsSlice';
import { Community } from '@/data/services/fetchCommunityService';
import {
  fetchCommunityInboxMessagesService,
  fetchCommunityInboxMessagesParams,
  CommunityInboxMessagesList,
} from '@/data/repositaries/CommunityInboxRepo';
import { useEffect } from 'react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

const useCommunityInboxs = (community: Community) => {
  const dispatch = useAppDispatch();
  const communityInboxs: CommunityInboxMessagesList = useAppSelector(
    (state) => state.communityInboxsSlice.value,
  );

  const {
    utils: { getBearerToken },
  } = useDGAuth();

  const _refreshCommunityInboxsData = async ({
    communityId,
  }: {
    communityId: string;
  }) => {
    dispatch(
      setCommunityInboxs(
        await fetchCommunityInboxMessagesService(
          {
            communityId: communityId,
            accessToken: (await getBearerToken()).jwtToken,
            communityInboxs: communityInboxs,
          } as fetchCommunityInboxMessagesParams,
          true,
        ),
      ),
    );
  };

  const loadMoreInboxs = async () => {
    if (community.community_id) {
      dispatch(
        setCommunityInboxs(
          await fetchCommunityInboxMessagesService({
            communityId: community.community_id,
            accessToken: (await getBearerToken()).jwtToken,
            communityInboxs: communityInboxs,
          } as fetchCommunityInboxMessagesParams),
        ),
      );
    }
  };

  const refreshInboxs = async () => {
    await _refreshCommunityInboxsData({
      communityId: community.community_id,
    });
  };

  useEffect(() => {
    const _saveRefresh = async () => {
      if (community.community_id && !communityInboxs.count) {
        // console.log('load communityInbox:', communityInboxs.count);
        await _refreshCommunityInboxsData({
          communityId: community.community_id,
        });
      }
    };

    _saveRefresh();
  }, [community]);

  return { communityInboxs, loadMoreInboxs, refreshInboxs };
};

export default useCommunityInboxs;
