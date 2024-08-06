/**
 * This router is for authentication within the community, if the user
 * -> the router is garanteed to be in the community path: /c/:communityPathId
 *
 * -> Is not authenticated, redirect to community login page
 * -> If the user is authenticated  render the children
 */
'use client';
import React, { useCallback, useMemo, createContext } from 'react';

// other library
import { useDGAuth, DGAuthState } from '@dttd-io/dg-auth-lib';
import { useAuthRouterStates } from '../providers/AuthRouterStatesContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

type AuthRouterProps = {
  children: React.ReactNode;
};

const _AuthRouter: React.FC<AuthRouterProps> = ({ children }) => {
  const {
    state: { pathname, searchParams, isAuthInit, isAuthenticated },
  } = useAuthRouterStates();
  const {
    navigate,
    // pathMatchesTemplate,
    // isCurrentPath,
    isRouteProtected,
  } = useAppRouting();

  // Handle Paths Transition
  const handleRouteTransition = async () => {
    // * -> Is not authenticated, redirect to community login page
    // and set next back to the current path
    if (isAuthenticated === false) {
      const newPath = navigate(routes.auth.login, {
        defaultOptions: {},
        searchParams: {
          next: pathname,
          ...Object.fromEntries(searchParams),
        },
        doNothingIfCurrent: true,
      });
      return;
    }

    // * -> If the user is authenticated and in the community, render the children
    // so do nothing
  };
  React.useEffect(() => {
    // Handle Protected Paths Transition: redirect user if needed
    // do nothing if checkIsAuthenticated() is null
    if (isAuthenticated !== null && isRouteProtected(pathname)) {
      handleRouteTransition();
    }
  }, [isAuthenticated, pathname]);

  /**
   * Render
   */
  // Handle non-protected routes
  if (!isRouteProtected(pathname)) {
    return <>{children}</>;
  }

  // From this point, we know the route is protected.
  // First, handle the initial unknown state
  let isLoading = false;
  let loadingText = '';
  if (!isAuthInit) {
    isLoading = true;
    loadingText = 'Initializing...';
  }

  // Next, handle the authentication check
  if (isAuthenticated === null) {
    isLoading = true;
    loadingText = 'Checking user Authentication...';
  }

  // we handle authentication states
  if (!isAuthenticated) {
    // User is not authenticated
    isLoading = true;
    loadingText = 'Redirecting to Login..';
  }

  if (isLoading) {
    return <LoadingPage loadingText={loadingText} />;
  }

  return <>{children}</>;
};

const AuthRouter: React.FC<AuthRouterProps> = ({ children }) => {
  return <_AuthRouter>{children}</_AuthRouter>;
};
export default AuthRouter;
