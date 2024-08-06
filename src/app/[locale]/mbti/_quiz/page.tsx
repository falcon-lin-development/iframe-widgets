/**
 * This is the default Componet for trackings with surveyjs
 */

// mootiez-main-mbti
'use client';
import { NextPage } from 'next';
import SurveyJsRenderer from '@/components/surveyJs/SurveyJsRenderer';
import { mbtiSurveyJson } from './quiz';
import { CompleteEvent, SurveyModel } from 'survey-core';
import { useEffect, useState } from 'react';
import {
  NavigateOptions,
  useAppRouting,
} from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { useSearchParams } from 'next/navigation';
import {
  submitSurvey,
  customerIOMainMBTI,
} from '@/data/repositaries/SurveyJsRepo';
import useCommunity from '@/hooks/useCommunity';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useMagicLinkSignInState } from '@/app/[locale]/auth/login/MagicLinkSignInButton.client';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setEmail as _setEmail,
  setErrorMessage as _setErrorMessage,
} from '@/redux/features/authSlice';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';

const useUpdateHttpReferer = (
  param: URLSearchParams,
  navigate: (
    pathTemplate: string,
    options?: NavigateOptions | undefined,
  ) => string | void,
) => {
  useEffect(() => {
    // Create a URL object based on the current location
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    const httpReferer = searchParams.get('httpreferer');

    // Define a method to check the validity of the httpReferer
    const isValidHttpReferer = (referer: string | null) => {
      console.log(`----------httpreferer: ${referer}--------`);
      return referer !== null && referer !== '' && referer !== 'notfound';
    };
    // If httpReferer is not valid, replace it with the correct httpReferer using document.referrer
    if (!isValidHttpReferer(httpReferer)) {
      const correctHttpReferer = document.referrer;

      // Only proceed if document.referrer is not empty
      if (correctHttpReferer) {
        // Set the correct httpReferer
        searchParams.set('httpreferer', correctHttpReferer);

        // Use the URL object to construct the new URL
        const newUrl = `${currentUrl.pathname}?${searchParams.toString()}`;

        // Replace the current URL with the new URL that includes the correct httpReferer
        // without reloading the page
        navigate(newUrl);
        // window.history.replaceState(null, '', newUrl);
      }
    }
  }, [param]); // This effect depends on 'param'. If 'param' changes, the effect will re-run.
};

const Page: NextPage = () => {
  const formId = 'mootiez-main-mbti';
  const param = useSearchParams();
  const { searchParamsMap } = useSearchParamsMap();

  const { sessionId, utmData } = useLogEvent();
  const { navigate } = useAppRouting();
  const { community } = useCommunity();
  const dispatch = useAppDispatch();
  const setEmail = (value: string) => {
    dispatch(_setEmail(value));
  };
  const _ = useUpdateHttpReferer(param, navigate);

  const handleResult = (sender: SurveyModel, formSessionId: string) => {
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
      ismale: 0,
      email: '' as any,
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
      if (key == 'gender') {
        if (value == 'f') {
          v.ismale = -1;
        } else if (value == 'm') {
          v.ismale = 1;
        }
      }
      if (key == 'email') {
        v.email = value as string;
        setEmail(value as string);
      }
    });

    return v;
  };

  const onSubmiteCallback = async (
    sender: SurveyModel,
    options: CompleteEvent,
    formSessionId: string,
  ) => {
    const v = handleResult(sender, formSessionId);
    console.log(v);

    // submit form
    await submitSurvey({
      formId,
      formSessionId,
      resposne: {
        ...sender.data,
        ...v,
      },
      persona_id: '-',
      communityId: community.community_id || '-',
      trackingData: {
        ...searchParamsMap,
        ...utmData,
        sessionId,
      },
    });
    // trigger customer.io
    customerIOMainMBTI({
      formSessionId,
    });

    // send magic link

    // Navigate to the next page
    navigate(routes.mbti._home, {
      searchParams: {
        ...searchParamsMap,
        ...v,
        ismbti: true,
        formsessionid: formSessionId,
        directsend: true,
      },
    });
  };

  return (
    <SurveyJsRenderer
      surveyJson={mbtiSurveyJson}
      formId={formId}
      onSubmiteCallback={onSubmiteCallback}
    />
  );
};

export default Page;
