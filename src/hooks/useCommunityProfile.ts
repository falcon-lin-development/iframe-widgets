// Reacts
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';

// Model
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { fetchCommunityProfileThunk } from '@/redux/features/community/communityProfileSlice';
import { PersonaCommunityProfile } from '@/data/graphql/models/PersonaCommunityProfile';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useMainClient } from '@/data/graphql/MainClientProvider';
import { DataState } from '@/redux/model';

const useCommunityProfile = (community: Pick<Community, 'community_id'>) => {
  const dispatch = useAppDispatch();
  const { client } = useMainClient();

  const communityProfile: PersonaCommunityProfile = useAppSelector(
    (state) => state.communityProfileSlice.value,
  ) as PersonaCommunityProfile;

  const communityProfileState: DataState = useAppSelector(
    (state) => state.communityProfileSlice.state,
  );

  // const _tutorialStates = _useTutorialStates({ communityProfile });
  const _otherFlowStates = _useOtherFlowStates({ communityProfile });

  const {
    getters: { checkIsAuthenticated },
    utils: { getBearerToken },
  } = useDGAuth();

  // functions
  const _refresh = async ({ communityId }: { communityId: string }) => {
    try {
      dispatch(
        fetchCommunityProfileThunk({
          qClient: client,
          communityId: communityId,
        }),
      );
    } catch (err) {
      console.log('useCommunity Profile Error:', err);
    }
  };

  // memo states
  const isInit = useMemo(() => {
    return (
      communityProfileState !== DataState.LOADING && // it's not loading
      communityProfileState !== DataState.IDLE &&
      Boolean(community.community_id) // it has a community id
    );
  }, [community, communityProfileState]);

  const is404 = useMemo(() => {
    return isInit && communityProfileState === DataState.ERROR;
  }, [isInit]);

  useEffect(() => {
    const _saveRefresh = async () => {
      if (community.community_id && !isInit && checkIsAuthenticated()) {
        await _refresh({
          communityId: community.community_id,
        });
      }
    };

    _saveRefresh();
  }, [community.community_id, checkIsAuthenticated]);

  return {
    isProfileInit: isInit,
    isProfile404: is404,
    communityProfile,
    refreshProfile: async () => {
      if (community.community_id) {
        return await _refresh({
          communityId: community.community_id,
        });
      }
    },
    state: {
      // tutorialStates: _tutorialStates,
      otherStates: _otherFlowStates,
    },
  };
};

export default useCommunityProfile;

/**
 * other states
 */
const _useOtherFlowStates = ({
  communityProfile,
}: {
  communityProfile: CommunityProfile;
}) => {
  /**
   * @dev special states for tutorial
   */
  const finishedOnboardingFlow = useMemo(() => {
    return Boolean(communityProfile?.data_store?.onboarding_flow_finished);
  }, [communityProfile.data_store]);
  // const onBoardingFlowCheckPoint = useMemo(() => {
  //   return communityProfile?.data_store?.onboarding_flow_checkpoint || 0;
  // }, [communityProfile.data_store]);

  return {
    finishedOnboardingFlow,
    onBoardingFlowCheckPoint: 0,
  };
};

// const _useTutorialStates = ({
//   communityProfile,
// }: {
//   communityProfile: CommunityProfile;
// }) => {
//   /**
//    * @dev special states for tutorial
//    */
//   const finishedOnboardingFlow = useMemo(() => {
//     return Boolean(communityProfile?.data_store?.onboarding_flow_finished);
//   }, [communityProfile.data_store]);
//   // const onBoardingFlowCheckPoint = useMemo(() => {
//   //   return communityProfile?.data_store?.onboarding_flow_checkpoint || 0;
//   // }, [communityProfile.data_store]);

//   return {
//     finishedOnboardingFlow,
//     onBoardingFlowCheckPoint: 0,
//   };
// };
