/**
 * @dev this page is for quiz detail page
 */
'use client';
import { NextPage } from 'next';
import CollectTaskDetailPage from './pages/CollectTaskDetailPage';

// db/models
import { COLLECT_TASKS_MAP } from '@/data/db/collect_tasks';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';
// import { Tutorials } from '@/data/graphql/models/PersonaCommunityProfile';
import OnboardingTutorialPage from './pages/_OnboardingTutorialPage';
import { useEffect } from 'react';

type Props = {
  params: {
    qid: string;
  };
};

const Page: NextPage<Props> = ({ params: { qid } }) => {
  const task = COLLECT_TASKS_MAP[qid];
  const subTask = task?.sub_tasks[0];
  const { searchParams, searchParamsMap } = useSearchParamsMap();
  // const isOnboardingTutorial = params.get('tutorial') === Tutorials.ONBOARDING;

  if (!task || !subTask) {
    return <div>Task not found</div>;
  }
  const isTaskLive = searchParams.get('islive') === 'true';

  // useEffect(()=>{
  //   console.log(searchParams.get("islive") === null);
  //   console.log(Boolean(searchParams.get("islive")));
  //   console.log(isTaskLive);
  // }, [])

  // if (isOnboardingTutorial) {
  //   return <OnboardingTutorialPage task={task} subTask={subTask} />;
  // }

  return (
    <CollectTaskDetailPage
      task={{
        ...task,
        is_live: isTaskLive,
      }}
      subTask={subTask}
    />
  );
};

export default Page;
