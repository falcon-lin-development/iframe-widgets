/**
 * @dev this page is for quiz detail page
 */
'use client';
import { NextPage } from 'next';

// db/models
import {
  COLLECT_TASKS_MAP,
  CollectionTask,
  CollectionTaskSubTaskType,
  CollectionSubTask,
} from '@/data/db/collect_tasks';

// skeleton
import TaskPageScaffold from '../../components/TaskPageScaffold';
import QuestAccordion from '@/components/accordions/QuestAccordion.client';
import { PlusIcon } from 'lucide-react';
import { Button, Typography } from '@mui/material';

// constants
import { ButtonID } from '@/constants';
import routes from '@/routes/routes';

// hooks
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import colors from '@/styles/colors.config';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export type Props = {
  task: CollectionTask;
  subTask: CollectionSubTask;
  anchors?: {
    onBoardingTuotialAnchorRef: React.MutableRefObject<HTMLElement | null>;
  };
};

const CollectTaskDetailPage: React.FC<Props> = ({ task, subTask, anchors }) => {
  const { logButtonClick } = useLogEvent();
  const { navigate } = useAppRouting();

  const _onCTAClick = useMemo(() => {
    if (subTask.sub_task_type === CollectionTaskSubTaskType.url) {
      return () => {
        navigate(subTask.task_content.target_url);
      };
    }
    return () => {};
  }, [task]);

  return (
    <>
      <TaskPageScaffold task={task} suggestedTasks={[]}>
        <>
          <QuestAccordion
            expanded={true}
            id={task.id.toString()}
            icon={<PlusIcon size={16} color={colors.neutralSwatch.main[30]} />}
            title={subTask.task_title}
            description={subTask.task_description}
            cta={
              <Button
                ref={
                  anchors?.onBoardingTuotialAnchorRef as React.RefObject<HTMLButtonElement>
                }
                fullWidth
                variant="contained"
                onClick={() => {
                  logButtonClick(
                    ButtonID.quests.open_survey,
                    `task: ${task.id}`,
                  );
                  _onCTAClick();
                }}
                disabled={!task.is_live}
              >
                <Typography
                  variant="labelLarge"
                  sx={{
                    transform: 'translateY(2px)',
                  }}
                >
                  Start Now
                </Typography>
              </Button>
            }
          ></QuestAccordion>
        </>
      </TaskPageScaffold>
    </>
  );
};

export default CollectTaskDetailPage;
