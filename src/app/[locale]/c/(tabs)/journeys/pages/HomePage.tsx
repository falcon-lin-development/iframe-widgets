/**
 * This is the entry point to the community home page
 */
'use client';

import React, { useMemo } from 'react';
import { NextPage } from 'next';

// models
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { Quest } from '@/data/services/fetchCommunityQuestsService';

// components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import CommunityNavBar from '@/components/navbars/CommunityNavBar.client';
import CommunityAppBar from '@/components/appbars/CommunityAppBar.client';
import { Box, Stack, Button } from '@mui/material';
import { HeroQuestImageCard } from '../QuestCards.client';

// models
import { QuestType } from '@/data/services/fetchCommunityQuestsService';
import { ButtonID } from '@/constants';
import routes from '@/routes/routes';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

type Props = {
  community: Community;
  communityProfile: CommunityProfile;
  quests: Quest[];
};

const NormalPage: NextPage<Props> = ({
  community,
  communityProfile,
  quests,
}) => {
  const { constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  return (
    <Scaffold
      appbar={<CommunityAppBar community={community} />}
      mainBody={
        <MainBody className="tw-text-black tw-rounded-lg">
          {quests.length > 0 ? (
            <Box
              sx={{
                padding: '1rem', // 16px
                width: '100%',
              }}
            >
              <Stack spacing={2}>
                {quests.slice(0).map((quest, index) => {
                  let _href;

                  if (quest.quest_type === QuestType.wouldyourather) {
                    _href = constructPath(routes.c.would_you_rather._home, {
                      options: {
                        questId: quest.quest_id,
                      },
                    });
                  } else if (quest.quest_type === QuestType.feature) {
                    _href = constructPath(
                      quest.quest_content?.target_url as string,
                    );
                  } else {
                    _href = constructPath(routes.c.journeys.detail._home, {
                      options: {
                        questId: quest.quest_id,
                      },
                    });
                  }
                  return (
                    <HeroQuestImageCard
                      key={quest.quest_id}
                      quest={quest}
                      href={_href}
                      onClick={() => {
                        logButtonClick(
                          ButtonID.quests.card,
                          `quest-card: ${quest.quest_id}`,
                        );
                      }}
                      aspectRatio={index === 0 ? '1/1' : '3/2'}
                    />
                  );
                })}
              </Stack>
              {/* <div className="body-small tw-text-neutralSwatch-80 tw-py-[1rem] tw-text-center">
                ...
              </div> */}
              <Box paddingTop="40px" aria-label="spacer" />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              we dont see any explore at the moment...
            </Box>
          )}
        </MainBody>
      }
      bottomNavbar={<CommunityNavBar communityProfile={communityProfile} />}
    />
  );
};

export default NormalPage;
