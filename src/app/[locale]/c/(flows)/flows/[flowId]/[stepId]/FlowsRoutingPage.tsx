'use client';

import React, { useEffect } from 'react';
import { NextPage } from 'next';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

// data
import { UIFlows } from '@/data/graphql/models/PersonaCommunityProfile';
import routes from '@/routes/routes';

// hooks
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';

type Props = {
  params: {
    locale: string;
    flowId: string;
    stepId: string;
  };
};

const Page: NextPage<Props> = ({ params: { locale, flowId, stepId } }) => {
  const currentStep = typeof stepId === 'string' ? parseInt(stepId) : 0;
  const currentFlow = flowId as UIFlows;
  const { navigate } = useAppRouting();
  const { searchParamsMap } = useSearchParamsMap();

  useEffect(() => {
    if (currentFlow === UIFlows.ONBOARDING) {
      navigate(routes.c.flow.onboarding._home, {
        searchParams: searchParamsMap,
      });
    }
  }, [currentStep, currentFlow]);

  return <LoadingPage loadingText="waiting to redirect...." />;
};

export default Page;
