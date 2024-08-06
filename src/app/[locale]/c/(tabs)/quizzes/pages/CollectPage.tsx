'use client';
import React, { useMemo } from 'react';
import { NextPage } from 'next';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// hooks
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import CommunityNavBar from '@/components/navbars/CommunityNavBar.client';
import CommunityAppBar from '@/components/appbars/CommunityAppBar.client';

// components
import {
  Box,
  Stack,
  Button,
  Typography,
  Link,
  Card,
  capitalize,
} from '@mui/material';
import { TaskHorizCard } from '@/components/cards/TaskHorizCard';

// models
import { QuestType } from '@/data/services/fetchCommunityQuestsService';
import routes from '@/routes/routes';
import assets, { ButtonID } from '@/constants';
import { CollectionTask, COLLECT_TASKS, isLive } from '@/data/db/collect_tasks';
import { QuestChip } from '@/components/QuestChip';
import colors from '@/styles/colors.config';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import { MBTI_TASK } from '@/data/db/tasks/mbti';
import { PRONOUNS_TASK } from '@/data/db/tasks/pronouns';
import { CHINESE_ZODIAC_TASK } from '@/data/db/tasks/chinesezodiac';
import { WESTERN_ZODIAC_TASK } from '@/data/db/tasks/westernzodiac';

type CollectPageProps = {
  community: Community;
  communityProfile: CommunityProfile;
  collectTasks: CollectionTask[];
};

const _useCollectPageState = () => {
  const {
    state: {
      alreadyHasMBTI,
      alreadyHasPronouns,
      userAttributesInit,
      alreadyHasChineseZodiac,
      alreadyHasWesternZodiac,
    },
  } = usePersonaAttributeBadges();

  const isTaskLive = (task: CollectionTask) => {
    if (
      task.id.toString() === PRONOUNS_TASK.id.toString() &&
      alreadyHasPronouns
    ) {
      return false;
    }
    if (task.id.toString() === MBTI_TASK.id.toString() && alreadyHasMBTI) {
      return false;
    }
    if (
      task.id.toString() === CHINESE_ZODIAC_TASK.id.toString() &&
      alreadyHasChineseZodiac
    ) {
      return false;
    }
    if (
      task.id.toString() === WESTERN_ZODIAC_TASK.id.toString() &&
      alreadyHasWesternZodiac
    ) {
      return false;
    }

    return true;
  };

  return {
    alreadyHasMBTI,
    alreadyHasPronouns,
    userAttributesInit,
    isTaskLive,
  };
};

const CollectPage: NextPage<CollectPageProps> = ({
  community,
  communityProfile,
  collectTasks,
}) => {
  const { navigate, constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  const { alreadyHasMBTI, alreadyHasPronouns, userAttributesInit, isTaskLive } =
    _useCollectPageState();

  if (!userAttributesInit) {
    return <LoadingPage loadingText="loading user attributes" />;
  }

  return (
    <Scaffold
      appbar={<CommunityAppBar community={community} />}
      mainBody={
        <MainBody className="tw-text-black tw-rounded-lg">
          {collectTasks.length > 0 ? (
            <Box
              sx={{
                padding: '1rem', // 16px
              }}
            >
              {/* <HeroQuestImageCard quest={communityQuests.quests[0]} /> */}
              <Box paddingTop={'6px'} aria-label="spacer" />
              <Typography
                variant="titleLarge"
                color={colors.neutralSwatch.main[30]}
              >
                Attributes
              </Typography>
              <Box paddingTop={'12px'} aria-label="spacer" />
              <Stack spacing={2}>
                {collectTasks.map((task, index) => {
                  return (
                    <TaskHorizCard
                      key={`${task.id}-${index}`}
                      task={{
                        ...task,
                        is_live: isTaskLive(task),
                      }}
                      href={constructPath(routes.c.quizzes.detail._home, {
                        options: {
                          qid: task.id,
                        },
                        searchParams: {
                          islive: isTaskLive(task),
                        },
                      })}
                      onClick={() => {
                        logButtonClick(
                          ButtonID.quests.card,
                          `collect-task-card: ${task.id}`,
                        );
                      }}
                    />
                  );
                })}
              </Stack>
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
              we dont see any quizzes at the moment...
            </Box>
          )}
        </MainBody>
      }
      bottomNavbar={<CommunityNavBar communityProfile={communityProfile} />}
    />
  );
};

export default CollectPage;
