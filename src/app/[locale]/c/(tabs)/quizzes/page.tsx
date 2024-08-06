'use client';
import React, { useMemo } from 'react';
import { NextPage } from 'next';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import CollectPage from './pages/CollectPage';
// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useSearchParams } from 'next/navigation';

// db / models
import { CollectionTask, COLLECT_TASKS } from '@/data/db/collect_tasks';
import { UIFlows } from '@/data/graphql/models/PersonaCommunityProfile';

const _quizPageState = () => {
  const { community, communityPathId } = useCommunity();
  const { communityProfile, isProfileInit } = useCommunityProfile(community);
  const collectTasks = COLLECT_TASKS;
  const params = useSearchParams();

  // const isQuizPageInit = useMemo(() => {
  //   return isProfileInit;
  // }, [isProfileInit]);

  return {
    state: {
      community,
      communityProfile,
      collectTasks,
      isQuizPageInit: isProfileInit,
      // isOnboardingTutorial: params.get('tutorial') === Tutorials.ONBOARDING,
    },
    // actions: {}
  };
};

const Page: NextPage = () => {
  const { navigate, constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  const {
    state: {
      community,
      communityProfile,
      collectTasks,
      isQuizPageInit,
      // isOnboardingTutorial,
    },
    // actions: {}
  } = _quizPageState();

  if (!isQuizPageInit) {
    return <LoadingPage loadingText="loading community data" />;
  }

  // if (isOnboardingTutorial) {
  //   return (
  //     <OnboardingTutorialPage
  //       community={community}
  //       communityProfile={communityProfile}
  //       collectTasks={collectTasks}
  //     />
  //   );
  // } else {
  return (
    <CollectPage
      community={community}
      communityProfile={communityProfile}
      collectTasks={collectTasks}
    />
  );
  // }
};

export default Page;
