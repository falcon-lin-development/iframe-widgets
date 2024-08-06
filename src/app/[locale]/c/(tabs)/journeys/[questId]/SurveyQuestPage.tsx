'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useCommunity from '@/hooks/useCommunity';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import useCommunityQuestDetail from '@/hooks/useCommunityQuestDetail';

import LoadingPage from '@/components/loadingScreens/LoadingPage';
import QuestPageScaffold from './QuestPageScaffold';

import { Button, capitalize } from '@mui/material';
import QuestAccordion from '@/components/accordions/QuestAccordion.client';

import { Users, ExternalLink } from 'lucide-react';
import routes from '@/routes/routes';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

type Props = {
  locale?: string;
  questId: string;
};

const SurveyQuestPage: React.FC<Props> = ({ locale, questId }) => {
  const { community, communityPathId } = useCommunity();
  // const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);
  const { communityQuestDetail } = useCommunityQuestDetail(community, questId);
  const { logButtonClick } = useLogEvent();

  const { navigate } = useAppRouting();
  if (
    !community.community_id ||
    // !communityProfile.community_id ||
    !(communityQuests.count >= 0) ||
    !communityQuestDetail?.quest?.quest_id
  ) {
    return <LoadingPage loadingText="Loading Survey Explore Data..." />;
  }

  return (
    <QuestPageScaffold
      // community={community}
      // communityProfile={communityProfile}
      communityQuests={communityQuests}
      quest={communityQuestDetail.quest}
    >
      <QuestAccordion
        expanded={true}
        id={communityQuestDetail.quest.quest_id}
        icon={<Users size={16} />}
        title={
          // capitalize(communityQuestDetail.quest.quest_title)
          communityQuestDetail.quest.quest_subtitle?.toLowerCase() ||
          communityQuestDetail.quest.quest_title.toLowerCase()
        }
        description={communityQuestDetail.quest.quest_title.toLowerCase()}
        cta={
          <Button
            fullWidth
            variant="contained"
            startIcon={<ExternalLink size={18} />}
            onClick={() => {
              logButtonClick(ButtonID.quests.open_survey, `survey: ${questId}`);
              navigate(routes.c.journeys.detail.survery, {
                options: {
                  questId: communityQuestDetail.quest.quest_id,
                },
              });
            }}
          >
            do survey
          </Button>
        }
      ></QuestAccordion>
    </QuestPageScaffold>
  );
};

export default SurveyQuestPage;
