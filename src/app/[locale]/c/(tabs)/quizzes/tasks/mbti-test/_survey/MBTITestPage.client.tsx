'use client';
import { NextPage } from 'next';

// models
import { MBTI_TEST_JSON } from '@/data/db/tasks/mbti';

// components
import SurveyJsRenderer from '@/components/surveyJs/SurveyJsRenderer';
import { CompleteEvent, SurveyModel } from 'survey-core';

// hooks
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { useSearchParams } from 'next/navigation';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';

export const MBTIformId = 'collect-mbti-attribute';
const MBTITestPage: NextPage = () => {
  const { navigate } = useAppRouting();
  const { searchParamsMap } = useSearchParamsMap();

  const onSubmiteCallback = async (
    sender: SurveyModel,
    options: CompleteEvent,
    formSessionId: string,
  ) => {
    const v = calculateScores(sender, formSessionId);
    console.log(v);

    navigate(routes.c.quizzes.tasks.mbti_test._home, {
      searchParams: {
        ...searchParamsMap,
        mbtiType: `${v.i > v.e ? 'I' : 'E'}${v.s > v.n ? 'S' : 'N'}${v.t > v.f ? 'T' : 'F'}${v.j > v.p ? 'J' : 'P'}`,
        // ...v,
        // ismbti: true,
        // formsessionid: formSessionId,
      },
    });
  };

  return (
    <SurveyJsRenderer
      surveyJson={MBTI_TEST_JSON}
      formId={MBTIformId}
      onSubmiteCallback={onSubmiteCallback}
    />
  );
};

export default MBTITestPage;

/**
 * @helpers
 *
 */

export const calculateScores = (sender: SurveyModel, formSessionId: string) => {
  const parseQuestion = (
    answer: string,
    key1: keyof typeof v,
    key2: keyof typeof v,
  ) => {
    if (answer === 'a') {
      v[key1] += 2.5;
    } else if (answer === 'b') {
      v[key1] += 1;
    } else if (answer === 'c') {
      v[key2] += 1;
    } else {
      v[key2] += 2.5;
    }
  };

  const data = sender.data;
  const v = {
    i: 0,
    e: 0,
    s: 0,
    n: 0,
    t: 0,
    f: 0,
    j: 0,
    p: 0,
  };

  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('question')) {
      if (
        key.endsWith('question1') ||
        key.endsWith('question2') ||
        key.endsWith('question3')
      ) {
        parseQuestion(value as string, 'i', 'e');
      } else if (
        key.endsWith('question4') ||
        key.endsWith('question5') ||
        key.endsWith('question6')
      ) {
        parseQuestion(value as string, 's', 'n');
      } else if (
        key.endsWith('question7') ||
        key.endsWith('question8') ||
        key.endsWith('question9')
      ) {
        parseQuestion(value as string, 'f', 't');
      } else if (
        key.endsWith('question10') ||
        key.endsWith('question11') ||
        key.endsWith('question12')
      ) {
        parseQuestion(value as string, 'j', 'p');
      }
    }
  });

  return v;
};
