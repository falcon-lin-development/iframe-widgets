'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';

import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';

import { Box, Stack, Typography } from '@mui/material';
import { QuestChip } from '@/components/QuestChip';
import { QuestImageCard } from '../QuestCards.client';

import colors from '@/styles/colors.config';
import Image from 'next/image';
import { Quest, QuestType } from '@/data/services/fetchCommunityQuestsService';
import assets from '@/constants';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { ButtonID } from '@/constants';

const DescriptionSection: React.FC<{
  quest: Quest;
  questDescription?: React.ReactNode | string | undefined;
}> = ({ quest, questDescription }) => {
  if (questDescription) {
    if (typeof questDescription === 'string') {
      return (
        <Typography variant="bodyMedium" sx={{ textAlign: 'left' }}>
          {questDescription}
        </Typography>
      );
    }
    return <>{questDescription}</>;
  }

  if (quest.quest_type === QuestType.quiz) {
    return (
      <>
        <Typography variant="bodyMedium" sx={{ textAlign: 'left' }}>
          Mootiez is about building a more authentic internet. we start by
          having fun and exploring who you really are!
        </Typography>
        <Box className="tw-pt-[8px]" aria-label="spacer" />
        <Typography variant="bodyMedium" sx={{ textAlign: 'left' }}>
          more tests are coming out.
        </Typography>
        <Box className="tw-pt-[8px]" aria-label="spacer" />
        <Typography variant="bodyMedium" sx={{ textAlign: 'left' }}>
          have an idea for one? let us know by tagging us on socials or DM-ing
          us for now.
        </Typography>
      </>
    );
  }

  const description = (
    <div className="body-medium tw-text-neutralSwatch-10">
      In today's world of performative social media, it's easy to feel lost in a
      sea of curated persons. Mootiez is here to change that by offering a space
      where you can truly be yourself. With Mootiez, create a personalized
      profile that highlights who you are, not just what you do.
    </div>
  );
  return description;
};

const QuestPageScaffold: React.FC<{
  // community: Community,
  // communityProfile: CommunityProfile,
  quest: Quest;
  communityQuests: { quests: Quest[]; count: number };
  children: React.ReactNode;
  questDetailTitle?: string;
  questDescription?: React.ReactNode | string;
}> = ({
  communityQuests,
  quest,
  children,
  questDetailTitle,
  questDescription,
}) => {
  const { logButtonClick } = useLogEvent();
  const { navigate, constructPath } = useAppRouting();

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
            key={quest.detail_img_path}
            src={quest.detail_img_path}
            height={320}
            width={430}
            alt={quest.quest_title}
            style={{
              borderRadius: '8px',
              width: 430,
              height: 'auto',
              objectFit: 'cover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.01)',
            }}
            priority
          />
          <Box
            className="tw-flex tw-flex-col tw-items-start tw-flex-grow tw-w-full"
            sx={{
              padding: '16px',
            }}
          >
            <QuestChip text={quest.quest_category || quest.quest_type} />
            <div className="tw-pt-[8px]" aria-label="spacer" />
            <div className="title-medium tw-text-primarySwatch-10">
              {questDetailTitle?.toLowerCase() ||
                quest.quest_title.toLowerCase()}
            </div>
            <div className="tw-pt-[8px]" aria-label="spacer" />
            <div className="body-medium tw-text-neutralSwatch-50">live</div>
            <div className="tw-pt-[16px]" aria-label="spacer" />
            {children}
            {/* <RewardSection quest={quest} /> */}
            <div className="tw-pt-[40px]" aria-label="spacer" />
            <div className="title-large tw-text-neutralSwatch-30">
              description
            </div>
            <div className="tw-pt-[16px]" aria-label="spacer" />
            <DescriptionSection
              quest={quest}
              questDescription={questDescription}
            />

            <div className="tw-pt-[40px]" aria-label="spacer" />
            <div className="title-large tw-text-neutralSwatch-30">
              explore more
            </div>
            <div className="tw-pt-[16px]" aria-label="spacer" />
            <Box width={'100%'}>
              <Stack spacing={2}>
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
            {/* <div className="body-small tw-text-neutralSwatch-30 tw-py-[1rem] tw-text-center">
              More Explore Coming Soon!
            </div> */}
          </Box>
        </MainBody>
      }
    />
  );
};

const RewardSection: React.FC<{ quest: Quest }> = ({ quest }) => {
  return (
    <>
      <div className="tw-pt-[40px]" aria-label="spacer" />
      <div className="title-large tw-text-neutralSwatch-30">Reward</div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          // src={communityQuestDetail.quest.reward_img_path}
          src={assets.deprecated.defaultReward}
          height={164}
          width={164}
          alt={quest.quest_title}
          style={{
            borderRadius: '8px',
            width: 164,
            height: 164,
            margin: '8px 0px',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0px',
        }}
      >
        <div className="body-large tw-text-neutralSwatch-50">Collectible</div>
        <div className="body-large tw-text-neutralSwatch-10">Pet</div>
      </Box>
    </>
  );
};

export default QuestPageScaffold;
