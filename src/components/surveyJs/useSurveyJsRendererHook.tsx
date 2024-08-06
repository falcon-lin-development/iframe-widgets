'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Model,
  ITheme,
  SurveyModel,
  ValueChangedEvent,
  CompleteEvent,
} from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';
import animationStyles from './animations.module.css';
import { themeJson } from './surveyTheme';
import { motion } from 'framer-motion';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { v4 as uuidv4 } from 'uuid';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { EventName } from '@/data/services/LogService';
import { useSearchParams } from 'next/navigation';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';

const _useUIHook = ({
  survey,
  currentPageIndex,
  setCurrentPageIndex,
}: {
  survey: SurveyModel;
  currentPageIndex: number;
  setCurrentPageIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const animateSurveyContent = ({
    reverse = false,
  }: { reverse?: boolean } = {}) => {
    const contentElement = document.querySelector('.sd-page') as HTMLElement;
    if (contentElement) {
      const animationClsNames = [
        animationStyles['slide-in'],
        animationStyles['reverse-slide-in'],
      ];
      let animationClassName;

      if (reverse) {
        animationClassName = animationStyles['reverse-slide-in'];
      } else {
        animationClassName = animationStyles['slide-in'];
      }
      contentElement.classList.remove(...animationClsNames);
      void contentElement.offsetWidth; // Trigger reflow
      contentElement.classList.add(animationClassName);
    }
  };
  useEffect(() => {
    survey.applyTheme(themeJson as unknown as ITheme);

    // // Alert on new answer
    // const answerLogger = (sender: SurveyModel, options: any) => {
    //     alert(`Question: ${options.name}, Answer: ${options.value}`);
    // };

    // Page change with direction
    const onPageChanged = (sender: SurveyModel, options: any) => {
      const newIndex = sender.currentPageNo;
      const isGoingForward = newIndex > currentPageIndex;
      setCurrentPageIndex(newIndex); // Update the current page index state
      if (isGoingForward) {
        animateSurveyContent();
      } else {
        animateSurveyContent({
          reverse: true,
        });
      }
    };

    const onValueChanged = (sender: SurveyModel, options: any) => {
      // Check if the current question is the email question
      console.log('on Value Changed:', options.name, ':', options.value);

      // Set a timeout before moving to the next page
      const currentQuestion = sender.getQuestionByName(options.name);

      // Check if the question is a radio button (or 'radiogroup' in SurveyJS)
      if (
        currentQuestion &&
        (currentQuestion.getType() === 'radiogroup' ||
          currentQuestion.getType() === 'imagepicker')
      ) {
        // Set a timeout before moving to the next page, but only for radio button questions
        setTimeout(function () {
          const result = sender.nextPage();
          console.log('Moved to next page:', result);
        }, 200); // Delay set to 0.2 seconds (200 milliseconds)
      }
    };

    survey.onCurrentPageChanged.add(onPageChanged);
    survey.onValueChanged.add(onValueChanged);

    return () => {
      survey.onCurrentPageChanged.remove(onPageChanged);
      survey.onValueChanged.remove(onValueChanged);
    };
  }, [survey, currentPageIndex]);
};

type SurveyJsHookProps = {
  formId?: string;
  communityProfile?: CommunityProfile;
  surveyJson: Record<string, any>;
  onSubmiteCallback: (
    sender: SurveyModel,
    options: CompleteEvent,
    formSessionId: string,
  ) => void;
};
const useSurveyJsRendererHook = ({
  surveyJson,
  communityProfile,
  formId,
  onSubmiteCallback,
}: SurveyJsHookProps) => {
  const [survey] = useState(() => new Model(surveyJson));
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // Track the current page index
  const _ = _useUIHook({
    survey,
    currentPageIndex,
    setCurrentPageIndex,
  });
  const { searchParamsMap } = useSearchParamsMap();
  const { logEvent, sessionId, utmData } = useLogEvent();
  const [formSessionId] = useState(uuidv4());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    logEvent(EventName.survey_view, {
      form_id: formId,
      form_session_id: formSessionId,
      persona_id: communityProfile?.persona_id ?? '-',
      view_time: questionStartTime,
      trackingData: {
        ...searchParamsMap,
        ...utmData,
        sessionId,
      },
    });
  }, []);

  useEffect(() => {
    // Alert on new answer
    const logValueChanged = (
      sender: SurveyModel,
      options: ValueChangedEvent,
    ) => {
      const timeSpent = Date.now() - questionStartTime;
      setQuestionStartTime(Date.now());
      logEvent(EventName.survey_progress, {
        form_id: formId,
        form_session_id: formSessionId,
        persona_id: communityProfile?.persona_id ?? '-',
        question_no: sender.currentPageNo,
        question_name: options.name,
        question_title: options.question.title,
        answer: options.value,
        time_elapsed: timeSpent,
        trackingData: {
          ...searchParamsMap,
          ...utmData,
          sessionId,
        },
      } as SurveyJsEventData);
    };

    const logStart = (sender: SurveyModel, options: any) => {
      const timeSpent = Date.now() - questionStartTime;
      setQuestionStartTime(Date.now());
      // just start
      if (sender.currentPageNo === 0) {
        logEvent(EventName.survey_start, {
          form_id: formId,
          form_session_id: formSessionId,
          persona_id: communityProfile?.persona_id ?? '-',
          question_no: sender.currentPageNo,
          time_elapsed: timeSpent,
          trackingData: {
            ...searchParamsMap,
            ...utmData,
            sessionId,
          },
        } as SurveyJsEventData);
      }
    };

    const logComplete = (sender: SurveyModel, options: any) => {
      const current_time = Date.now();
      logEvent(EventName.survey_submit, {
        form_id: formId,
        form_session_id: formSessionId,
        persona_id: communityProfile?.persona_id ?? '-',
        time_elapsed: current_time - questionStartTime,
        finished_time: current_time,
        trackingData: {
          ...searchParamsMap,
          ...utmData,
          sessionId,
        },
      } as SurveyJsEventData);
    };

    // Page change with direction
    survey.onCurrentPageChanging.add(logStart);
    survey.onValueChanged.add(logValueChanged);
    survey.onComplete.add(logComplete);
    const _onSubmiteCallback = (
      sender: SurveyModel,
      options: CompleteEvent,
    ) => {
      onSubmiteCallback(sender, options, formSessionId);
    };
    survey.onComplete.add(_onSubmiteCallback);
    return () => {
      survey.onCurrentPageChanging.remove(logStart);
      survey.onValueChanged.remove(logValueChanged);
      survey.onComplete.remove(logComplete);
      survey.onComplete.remove(_onSubmiteCallback);
    };
  }, [survey, questionStartTime]);

  return {
    state: {
      survey,
      formSessionId,
    },
    utils: {
      // animateSurveyContent
    },
  };
};

export default useSurveyJsRendererHook;

type SurveyJsEventData = {
  form_id: string;
  form_session_id: string;
  persona_id: string; // does not have the information
  time_elapsed: number;
};
