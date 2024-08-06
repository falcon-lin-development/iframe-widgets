/**
 * This page is for receiving the user's MBTI test results.
 * -> store info into localstorage
 *
 * -> if logged in, go to you already have mootiez page
 * -> else move to login page
 *
 * http://localhost:3000/mbti/?s=1&referralcode1nCm3Lzd=&p=2&i=3.5&httpreferer=notfound&ismbti=true&channel=telegram&t=8.5&j=2.5&e=1&f=1&email=falcon.lin%40dttd.io&ismale=1&n=5
 * https://connect.mootiez.com/mbti/?s=1&referralcode=1nCm3Lzd&p=2&i=3.5&httpreferer=notfound&ismbti=true&channel=telegram&t=8.5&j=2.5&e=1&f=1&email=falcon.lin%40dttd.io&ismale=1&n=5
 * https://dev-deploy.d2k2zdjsslsd2b.amplifyapp.com/mbti/?s=1&referralcode=&p=2&i=3.5&httpreferer=notfound&ismbti=true&channel=telegram&t=8.5&j=2.5&e=1&f=1&email=&ismale=1&n=5
 */

'use client';
import React, { use, useEffect, useState } from 'react';
import { Metadata, NextPage } from 'next';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import useMBTIData from '@/hooks/useMBTIData';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import routes from '@/routes/routes';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setEmail } from '@/redux/features/authSlice';
import { clearState as clearCommunityProfileState } from '@/redux/features/community/communityProfileSlice';
import { resetAllState } from '@/redux/store';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useAuthRouterStates } from '@/app/providers/AuthRouterStatesContextProvider';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page: NextPage<Props> = ({ searchParams }) => {
  // init mbti data and redirect to get-my-mootiez page.
  const dispatch = useAppDispatch();
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);

  const { navigate } = useAppRouting();
  const {
    utils: { dgSignOut },
  } = useDGAuth();
  const {
    state: { isAuthenticated, isJoinedCommunity },
  } = useAuthRouterStates();

  const resetAllState = async () => {
    dispatch(clearCommunityProfileState());
    try {
      await dgSignOut();
    } catch (e) {
      console.error(e);
    }
  };
  // reset all state
  useEffect(() => {
    resetAllState();
  }, []);

  // store the data into localstorage, not overwriting existing data
  const { mbtiData } = useMBTIData(searchParams);
  const param = new URLSearchParams(searchParams as Record<string, any>);

  useEffect(() => {
    if (searchParams && searchParams['email']) {
      dispatch(setEmail(searchParams['email'] as string));
    }
  }, []);

  useEffect(() => {
    if (
      isAuthenticated === true ||
      Object.keys(communityProfile).length > 0 ||
      communityProfile.community_id ||
      isJoinedCommunity === true
    ) {
      return;
    } else {
      console.log('isAuthenticated: ', isAuthenticated, 'start navigation');
      console.log('communityProfile: ', communityProfile, 'start navigation');
      if (!searchParams || !searchParams['ismbti']) {
        navigate(routes._home);
      } else {
        if (mbtiData && Object.keys(mbtiData).length > 0) {
          navigate(routes.mbti.get_my_mootiez + '?' + param.toString());
        }
      }
    }
  }, [mbtiData, isAuthenticated, communityProfile, isJoinedCommunity]);

  // if not comming from MBTI test page, do nothing and redirect to home page
  if (!searchParams || !searchParams['ismbti']) {
    return <LoadingPage loadingText="welcome to the home page" />;
  }
  return <LoadingPage loadingText="initializing your mootiez data" />;
};

export default Page;
