'use client';
import { NextPage } from 'next';
import { Quest } from '@/data/services/fetchCommunityQuestsService';
import useCommunity from '@/hooks/useCommunity';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import QuestPageScaffold from '../QuestPageScaffold';

import LoadingPage from '@/components/loadingScreens/LoadingPage';
import QuestAccordion from '@/components/accordions/QuestAccordion.client';
import { Plus, ExternalLink } from 'lucide-react';
import { Button } from '@mui/material';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

type Props = {
  quest: Quest;
};

const Page: NextPage<Props> = ({ quest }) => {
  const { community, communityPathId } = useCommunity();
  const { communityQuests } = useCommunityQuests(community);
  const { logButtonClick } = useLogEvent();

  if (!community.community_id || !(communityQuests.count >= 0)) {
    return <LoadingPage loadingText="Loading Explore Data..." />;
  }

  return (
    <QuestPageScaffold communityQuests={communityQuests} quest={quest}>
      <QuestAccordion
        id={quest.quest_id}
        icon={<Plus size={16} color="black" />}
        title={"let's be moots"}
        description={"we're on tiktok, instagram and twitter"}
        expanded={true} // default to expanded
        cta={
          <Button
            fullWidth
            variant="contained"
            startIcon={<ExternalLink size={18} />}
            onClick={() => {
              logButtonClick(ButtonID.quests.follow_instagram, 'instagram');
              window.open('https://mootiez.me/@mootiezteam', '_blank');
            }}
          >
            connect with us
          </Button>
        }
      ></QuestAccordion>
    </QuestPageScaffold>
  );
};

export default Page;
