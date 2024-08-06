'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';

import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';

import { Box, Stack, Typography } from '@mui/material';
import { QuestChip } from '@/components/QuestChip';

import colors from '@/styles/colors.config';
import Image from 'next/image';
import { Quest, QuestType } from '@/data/services/fetchCommunityQuestsService';
import assets from '@/constants';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { ButtonID } from '@/constants';
import { CollectionTask } from '@/data/db/collect_tasks';
import {
  TaskHorizCard,
  DEFAULT_TASK_IMAGE_BG,
} from '@/components/cards/TaskHorizCard';

const QuizPageScaffold: React.FC<{
  children: React.ReactNode;
  task: CollectionTask;
  suggestedTasks: CollectionTask[];
}> = ({ suggestedTasks, task, children }) => {
  const { logButtonClick } = useLogEvent();
  const { navigate, constructPath } = useAppRouting();

  return (
    <Scaffold
      appbar={<AppBar backButton={<BackIconButton />} title={'Collect'} />}
      mainBody={
        <MainBody
          style={{
            color: colors.primarySwatch.main[10],
          }}
        >
          <Image
            key={task.banner}
            src={task.banner}
            height={250 * 2}
            width={375 * 2}
            alt={task.detail_tag}
            style={{
              objectFit: 'contain',
              aspectRatio: '375 / 250',
              // height: 'auto',
              // width: 'auto',
              background: task?.css?.background || DEFAULT_TASK_IMAGE_BG,
            }}
            priority
          />
          <Box
            className="tw-flex tw-flex-col tw-items-start tw-flex-grow tw-w-full"
            sx={{
              padding: '16px',
            }}
          >
            <QuestChip text={task.detail_tag} />
            <div className="tw-pt-[8px]" aria-label="spacer" />
            <Typography
              variant="titleMedium"
              color={colors.neutralSwatch.main[10]}
              textAlign={'left'}
            >
              {task.short_description}
            </Typography>
            <div className="tw-pt-[8px]" aria-label="spacer" />
            <Typography
              variant="bodyMedium"
              color={colors.neutralSwatch.main[50]}
              textAlign={'left'}
            >
              Live
            </Typography>
            <div className="tw-pt-[16px]" aria-label="spacer" />
            {children}

            <div className="tw-pt-[40px]" aria-label="spacer" />
            <Typography
              variant="titleLarge"
              color={colors.neutralSwatch.main[30]}
              textAlign={'left'}
            >
              Description
            </Typography>
            <div className="tw-pt-[16px]" aria-label="spacer" />

            <Typography
              variant="bodyMedium"
              color={colors.neutralSwatch.main[10]}
              textAlign={'left'}
            >
              {task.full_description}
            </Typography>

            <div className="tw-pt-[40px]" aria-label="spacer" />
            {suggestedTasks.length > 0 && (
              <>
                <Typography
                  variant="titleLarge"
                  color={colors.neutralSwatch.main[30]}
                  textAlign={'left'}
                >
                  Explore More
                </Typography>
                <div className="tw-pt-[16px]" aria-label="spacer" />
                <Stack spacing={2}>
                  {suggestedTasks &&
                    suggestedTasks.slice(0, 2).map((_task, index) => {
                      return (
                        <TaskHorizCard
                          key={`${_task.id}-${index}`}
                          task={_task}
                          href={constructPath(routes.c.journeys.detail._home, {
                            options: {
                              qid: _task.id,
                            },
                          })}
                          onClick={() => {
                            logButtonClick(
                              ButtonID.quests.other_card_detail,
                              `collect-task-card: ${_task.id}`,
                            );
                          }}
                        />
                      );
                    })}
                </Stack>
              </>
            )}
          </Box>
        </MainBody>
      }
    />
  );
};

export default QuizPageScaffold;
