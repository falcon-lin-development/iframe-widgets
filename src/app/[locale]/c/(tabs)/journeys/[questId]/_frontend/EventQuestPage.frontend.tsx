'use client';
import { NextPage } from 'next';
import { Quest, QuestType } from '@/data/services/fetchCommunityQuestsService';
import useCommunity from '@/hooks/useCommunity';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import Scaffold from '@/components/scaffolds/Scaffold';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import colors from '@/styles/colors.config';
import Image from 'next/image';
import AppBar from '@/components/appbars/AppBar';
import { QuestImageCard } from '../../QuestCards.client';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { ButtonID } from '@/constants';
import conig from '@/../tailwind.config';

type Props = {
  quest: Quest;
};

const Page: NextPage<Props> = ({ quest }) => {
  const { community, communityPathId } = useCommunity();
  const { communityQuests } = useCommunityQuests(community);
  const { logButtonClick } = useLogEvent();
  const { navigate, constructPath } = useAppRouting();

  if (!community.community_id || !(communityQuests.count >= 0)) {
    return <LoadingPage loadingText="Loading Explore Data..." />;
  }

  return (
    <Scaffold
      appbar={<AppBar backButton={<BackIconButton />} title={'explore'} />}
      mainBody={
        <MainBody
          style={{
            borderRadius: '8px',
            color: colors.primarySwatch.main[10],
          }}
        >
          <Image
            src={quest.detail_img_path}
            width={430}
            height={10200}
            alt={quest.quest_title}
            style={{
              borderRadius: '8px',
              width: 'auto',
              height: 'auto',
              objectFit: 'cover',
            }}
            priority
          />
          <Box
            className="tw-flex tw-flex-col tw-items-start tw-flex-grow tw-w-full"
            sx={{
              padding: '16px',
            }}
          >
            <Box sx={{ paddingTop: '1rem' }}></Box>
            <div className="title-large tw-text-neutralSwatch-30">
              explore more
            </div>
            <div className="tw-pt-[8px]" aria-label="spacer" />
            <Stack
              spacing={2}
              sx={{
                width: '100%',
              }}
            >
              {communityQuests.quests &&
                communityQuests.quests
                  .filter((_quest) => _quest.quest_id != quest.quest_id)
                  .slice(0, 2)
                  .map((_quest, index) => {
                    return (
                      <QuestImageCard
                        key={_quest.quest_id}
                        quest={_quest}
                        href={constructPath(routes.c.journeys.detail._home, {
                          options: {
                            questId: _quest.quest_id,
                          },
                        })}
                        onClick={() => {
                          logButtonClick(
                            ButtonID.quests.other_card_detail,
                            `quest-card: ${_quest.quest_id}`,
                          );
                        }}
                      />
                    );
                  })}
            </Stack>
          </Box>
        </MainBody>
      }
    />
  );
};

export default Page;
