'use client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import LoadingPage from '@/components/loadingComponents/LoadingPageTransition';
import { Quest } from '@/data/services/fetchCommunityQuestsService';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { Widget } from '@typeform/embed-react';
import { useEffect, useMemo, useState } from 'react';
import QuestPageScaffold from '../QuestPageScaffold';

import useCommunityQuests from '@/hooks/useCommunityQuests';
import useCommunityQuestDetail from '@/hooks/useCommunityQuestDetail';
import QuestAccordion from '@/components/accordions/QuestAccordion.client';
import { ExternalLink, Users, Plus } from 'lucide-react';
import { Button, capitalize } from '@mui/material';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { ButtonID } from '@/constants';

type Props = {
  quest: Quest;
};

const TypeformQuestpage: React.FC<Props> = ({ quest }) => {
  const { community, communityPathId } = useCommunity();
  // const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);
  const { logButtonClick } = useLogEvent();
  const { navigate } = useAppRouting();

  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const [email, setEmail] = useState<string>('');

  return (
    <QuestPageScaffold
      // community={community}
      // communityProfile={communityProfile}
      communityQuests={communityQuests}
      quest={quest}
    >
      <QuestAccordion
        expanded={true}
        id={quest.quest_id}
        icon={<Plus size={16} />}
        title={
          // capitalize(quest.quest_subtitle || quest.quest_title)
          quest.quest_subtitle?.toLowerCase() || quest.quest_title.toLowerCase()
        }
        description={
          quest.quest_body?.toLowerCase() || quest.quest_title.toLowerCase()
        }
        cta={
          <Button
            fullWidth
            variant="contained"
            startIcon={<ExternalLink size={18} />}
            onClick={() => {
              logButtonClick(
                ButtonID.quests.open_typeform,
                `${quest?.quest_content?.target_url}`,
              );
              navigate(routes.c.journeys.detail.typeform, {
                options: {
                  questId: quest.quest_id,
                },
              });
            }}
          >
            Start Now
          </Button>
        }
      ></QuestAccordion>
    </QuestPageScaffold>
  );
};

export default TypeformQuestpage;
