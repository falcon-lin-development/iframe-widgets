'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import useCommunityQuestDetail from '@/hooks/useCommunityQuestDetail';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useRouter } from 'next/navigation';

import LoadingPage from '@/components/loadingScreens/LoadingPage';
import SurveyQuestPage from './SurveyQuestPage';
import IntagramSocialPage from './_frontend/IntagramSocialPage.frontend';
import DISharePage from './_frontend/DISharePage.frontend';
import { Quest, QuestType } from '@/data/services/fetchCommunityQuestsService';
import EventQuestPage from './_frontend/EventQuestPage.frontend';
import TypeformQuestpage from './_frontend/TypeformQuestpage.frontend';

// db Journeys
import DBQuests from '@/data/db/quests.json';
import routes from '@/routes/routes';

type Props = {
  params: {
    locale: string;
    questId: string;
  };
};

const Page: NextPage<Props> = ({ params: { locale, questId } }) => {
  // frontend Journeys
  const _frontendQuests = DBQuests as Quest[];
  if (_frontendQuests.some((quest) => quest.quest_id === questId)) {
    const _quest = _frontendQuests.find((quest) => quest.quest_id === questId);
    if (_quest?.quest_type === QuestType.social) {
      return <IntagramSocialPage quest={_quest!} />;
    }
    if (
      _quest?.quest_type === QuestType.share ||
      _quest?.quest_type === QuestType.myreport
    ) {
      return <DISharePage quest={_quest!} />;
    }
    if (_quest?.quest_type === QuestType.quiz) {
      // set it in useEffect
      return <TypeformQuestpage quest={_quest} />;
      // return <BackAndRedirectPage quest={_quest} />;
    }
    if (_quest?.quest_type === QuestType.event) {
      return <EventQuestPage quest={_quest} />;
    }
  } else {
    return <_BackendQuestPage questId={questId} />;
  }
};

const _BackendQuestPage: React.FC<{ questId: string }> = ({ questId }) => {
  // normal Explore
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);
  const { communityQuestDetail } = useCommunityQuestDetail(community, questId);

  if (
    !community.community_id ||
    !communityProfile.community_id ||
    !(communityQuests.count >= 0) ||
    !communityQuestDetail?.quest?.quest_id
  ) {
    return <LoadingPage loadingText="Loading Explore Page..." />;
  }

  if (communityQuestDetail.quest.quest_type === QuestType.survey) {
    return <SurveyQuestPage questId={questId} />;
  }

  throw new Error('Explore type not supported');
};

export default Page;
