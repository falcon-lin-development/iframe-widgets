/**
 * @dev this page is for user who finished collect tasks and have custom after flows.
 */
'use client';
import { NextPage } from 'next';
import React from 'react';
import DoYouKnowYourMBTIPage from './_DoYouKnowYourMBTIPage.client';
import MBTIConfirmationPage from './_MBTIConfirmationPage.client';
import MBTITestPage from './_survey/MBTITestPage.client';

// db/model
import { MBTI_TASK, MBTI_TYPE } from '@/data/db/tasks/mbti';
import routes from '@/routes/routes';

// hooks
import { useSearchParams } from 'next/navigation';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';

export enum MBTI_TEST_PAGES {
  do_you_know_your_mbti = 'do_you_know_your_mbti',
  mbti_test = 'mbti_test',
  mbti_confirmation = 'mbti_confirmation',
}

export const _mbtiTestPageState = () => {
  const [page, setPage] = React.useState(MBTI_TEST_PAGES.do_you_know_your_mbti);
  const [mbtiType, setMbtiType] = React.useState<MBTI_TYPE | null>(null);
  const currentTask = MBTI_TASK;

  // check if mbtiType is in the query params
  const params = useSearchParams();
  const { navigate } = useAppRouting();

  // run at the beginning
  React.useEffect(() => {
    const _mbtiType = params.get('mbtiType');
    if (_mbtiType) {
      setMbtiType(_mbtiType as MBTI_TYPE);
      setPage(MBTI_TEST_PAGES.mbti_confirmation);
    }
  }, []);

  React.useEffect(() => {
    if (mbtiType) {
      navigate(routes.c.quizzes.tasks.mbti_test._home, {
        searchParams: {
          tutorial: params.get('tutorial') || '',
          mbtiType,
        },
      });
    } else {
      navigate(routes.c.quizzes.tasks.mbti_test._home, {
        searchParams: {
          tutorial: params.get('tutorial') || '',
        },
      });
    }
  }, [mbtiType]);

  return {
    state: {
      currentTask,
      currentPage: page,
      mbtiType,
    },
    actions: {
      setPage,
      setMbtiType,
    },
  };
};

const Page: NextPage = () => {
  const __mbtiTestPageState = _mbtiTestPageState();
  const { currentPage } = __mbtiTestPageState.state;
  console.log(currentPage);

  if (currentPage === MBTI_TEST_PAGES.do_you_know_your_mbti) {
    return <DoYouKnowYourMBTIPage pageState={__mbtiTestPageState} />;
  } else if (currentPage === MBTI_TEST_PAGES.mbti_confirmation) {
    return <MBTIConfirmationPage pageState={__mbtiTestPageState} />;
  } else if (currentPage === MBTI_TEST_PAGES.mbti_test) {
    return <MBTITestPage />;
  }

  return (
    <>
      <h1>Page Not Found</h1>
    </>
  );
};

export default Page;

/**
 *
 * @returns Pages
 */

const CollectTaskAfterFlow: React.FC = () => {
  return (
    <>
      <div>
        <h1>Collect Task After Flow</h1>
      </div>
    </>
  );
};
