/**
 * This page is for google callback
 * e.g.: http://localhost:3000/auth/google/callback?code=7ffc4b8c-d14a-467e-a54c-2259f1859c3b&state=L4uizb9qbdaHJqEpzghfMKyg6zVdMbQW-7b22746172676574223a222f632f312f617574682f6c6f67696e227d
 * This page is not protected by the RootRouter
 *
 */
'use client';
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useDGAuth, DGAuthState } from '@dttd-io/dg-auth-lib';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import routes from '@/routes/routes';
import useCommunity from '@/hooks/useCommunity';

const Page: NextPage = () => {
  const {
    state: { authState, customOAuthState },
    getters: { checkIsAuthenticated },
  } = useDGAuth();
  const { navigate } = useAppRouting();
  const { community } = useCommunity();

  const _navigateToDestination = async () => {
    let { nexturl, loginurl } = JSON.parse(customOAuthState ?? '{}');
    nexturl ?? console.error('nexturl is undefined');
    loginurl ?? console.error('loginurl is undefined');
    nexturl = nexturl ?? routes._home;
    loginurl = loginurl ?? routes._home_login;

    if (checkIsAuthenticated()) {
      navigate(nexturl);
      return;
    } else if (checkIsAuthenticated() === false) {
      navigate(loginurl);
      return;
    } else {
      throw new Error('unexpected error');
    }
  };

  useEffect(() => {
    if (checkIsAuthenticated() !== null) {
      console.log(
        'authState:',
        authState,
        'customOAuthState:',
        customOAuthState,
      );
      _navigateToDestination();
    }
  }, [authState, customOAuthState]);

  if (community === undefined || checkIsAuthenticated() === null) {
    return <LoadingPage loadingText="Fetching Google Return Parameters" />;
  }
  return <LoadingPage loadingText="Redirecting to destination" />;
};

export default Page;
