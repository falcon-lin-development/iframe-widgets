'use client';
import 'survey-core/defaultV2.min.css';
import React, { useEffect, useState } from 'react';
import { Model, ITheme, SurveyModel, CompleteEvent } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { motion } from 'framer-motion';
import useSurveyJsRendererHook from './useSurveyJsRendererHook';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import LoadingPage from '../loadingScreens/LoadingPage';
import colors from '@/styles/colors.config';

type Prop = {
  formId?: string;
  communityProfile?: CommunityProfile;
  surveyJson: any;
  onSubmiteCallback: (
    sender: SurveyModel,
    options: CompleteEvent,
    formSessionId: string,
  ) => void;
};

const SurveyJsRenderer: React.FC<Prop> = ({
  formId,
  surveyJson,
  communityProfile,
  onSubmiteCallback,
}) => {
  const {
    state: { survey },
  } = useSurveyJsRendererHook({
    formId,
    surveyJson,
    communityProfile,
    onSubmiteCallback,
  });
  const [init, setInit] = useState(false);

  const pageTransitionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3 } },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // make Survey the last thing to render
      setInit(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!init) return <LoadingPage />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageTransitionVariants}
      transition={{ duration: 1 }}
      style={{
        minHeight: '100vh',
        background: colors.primarySwatch.main[90],
      }}
    >
      <Survey
        model={survey}
        style={{
          minHeight: '100vh',
        }}
      />
    </motion.div>
  );
};

export default SurveyJsRenderer;
