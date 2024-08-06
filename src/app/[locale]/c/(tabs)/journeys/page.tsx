/**
 * This is the entry point to the community home page
 */
'use client';
import React, { useMemo } from 'react';
import { NextPage } from 'next';

// Page
import NormalPage from './pages/HomePage';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';

// components
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// models
import { QuestType } from '@/data/services/fetchCommunityQuestsService';

const Page: NextPage = () => {
  const { community, communityPathId } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);

  const journeyQuests = useMemo(() => {
    if (!communityQuests.quests) return [];

    return communityQuests.quests.filter(
      (quest) => quest.quest_type !== QuestType.quiz,
    );
  }, [communityQuests.quests]);

  if (
    !community.community_id ||
    !communityProfile.community_id ||
    !(communityQuests.count >= 0)
  ) {
    return <LoadingPage loadingText="loading community data" />;
  }

  // if (showTutorial) {
  //   return (
  //     <TutorialPage
  //       community={community}
  //       communityProfile={communityProfile}
  //       quests={journeyQuests}
  //     />
  //   );
  // } else {
  return (
    <NormalPage
      community={community}
      communityProfile={communityProfile}
      quests={journeyQuests}
    />
  );
  // }
};

export default Page;
