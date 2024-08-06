'use client';

import React, { useEffect } from 'react';
import { Metadata, NextPage } from 'next';
import useMBTIData from '@/hooks/useMBTIData';
import { useAuthRouterStates } from '../../../providers/AuthRouterStatesContextProvider';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { MBTIData, isMBTIDataValid } from '@/redux/features/mbti/mbtiSlice';
import GenMootiezPage from './GenMootiezPage';
import AlreadyHasMootiezPage from './AlreadyHasMootiezPage';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page: NextPage<Props> = ({ searchParams }) => {
  // case 1: user not logged in, login in then go to get-my-mootiez page ->
  //      -> 1a) if user has already mootiez, show already has mootiez
  //      -> 1b) if user not has mootiez and MBTI data is clean, gen mootiez and join community
  //      -> 1c) if user not has mootiez and MBTI data is not clean, go to join page redirect back to the typeform

  // case 2: user is loggin in, go to get-my-mootiez page ->
  //      -> 2a) if user has already mootiez, show already has mootiez
  //      -> 2b) if user not has mootiez and MBTI data is clean, gen mootiez and join community
  //      -> 2c) if user not has mootiez and MBTI data is not clean, go to join page redirect back to the typeform
  const {
    state: { isJoinedCommunity },
  } = useAuthRouterStates();
  const { mbtiData } = useMBTIData(searchParams);

  if (isJoinedCommunity === null) {
    return <LoadingPage loadingText="Initializing your mootiez Data" />;
  } else if (isJoinedCommunity === false) {
    if (isMBTIDataValid(mbtiData) === false) {
      // return <JoinPage />;
      return <LoadingPage></LoadingPage>;
    } else {
      return <GenMootiezPage />;
    }
  } else {
    return <AlreadyHasMootiezPage />;
  }
};

export default Page;
