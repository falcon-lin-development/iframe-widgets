/**
 * This router is for authentication within the community, if the user
 * -> the router is garanteed to be in the community path: /c
 *
 * so the user should be already authenticated when they see this router.
 */
'use client';
import React, { useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// other library
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { useAuthRouterStates } from '../../../providers/AuthRouterStatesContextProvider';
import { UIFlows } from '@/data/graphql/models/PersonaCommunityProfile';

type CommunityAuthRouterProps = {
  children: React.ReactNode;
};

const CommunityAuthRouter: React.FC<CommunityAuthRouterProps> = ({
  children,
}) => {
  const {
    hooks: { communityProfileHook },
    state: { pathname, searchParamsMap, isAuthenticated, isJoinedCommunity },
  } = useAuthRouterStates();
  const { navigate, isRouteCommunityProtected } = useAppRouting();

  // Handle Paths Transition
  const handleRouteTransition = async () => {
    /**
     * @dev Authenticated but not finished flow 1 yet
     *      goes to flow page
     *
     * @dev if users' already in a flow,
     *      even if its not onboarding, we should not redirect them
     * */
    const isInFlow =
      Boolean(pathname.includes(routes.c.flows._home)) ||
      Boolean(pathname.includes(routes.c.flow.onboarding._home));
    if (
      isAuthenticated && // authenticated
      !isJoinedCommunity && // not joined community
      // !communityProfileHook.state.otherStates.finishedOnboardingFlow && // not finished onboarding
      !isInFlow // not in a flow
    ) {
      /**
       * @dev direct user back to the onboarding flow
       */
      const newPath = navigate(routes.c.flows.flowId.stepId._home, {
        options: {
          flowId: UIFlows.ONBOARDING,
          stepId: `${communityProfileHook.state.otherStates.onBoardingFlowCheckPoint}`,
        },
        searchParams: {
          // @dev keep all the search params as is
          ...searchParamsMap,
        },
      });
      return;
    }
  };
  React.useEffect(() => {
    // Handle Protected Paths Transition: redirect user if needed
    // do nothing if checkIsAuthenticated() is null
    if (
      isAuthenticated !== null &&
      isJoinedCommunity !== null &&
      isRouteCommunityProtected(pathname)
    ) {
      handleRouteTransition();
    }
  }, [pathname, isAuthenticated, isJoinedCommunity]);

  /**
   * @Rendering
   */
  // Handle comunity non-protected routes
  if (!isRouteCommunityProtected(pathname)) {
    return <>{children}</>;
  }

  let isLoading = false;
  let loadingText = '';
  // From this point, we know the route is protected.
  // Next, handle the authentication check
  if (isAuthenticated && isJoinedCommunity === null) {
    isLoading = true;
    loadingText = 'Checking is authenticated to the community...';
  }

  // we handle authentication states
  if (isAuthenticated && isJoinedCommunity === false) {
    // User is authenticated, but not to the community
    isLoading = true;
    loadingText = 'Redirecting to Onboarding Flow...';
  }
  if (isLoading) {
    return <LoadingPage loadingText={loadingText} />;
  } else if (isAuthenticated && isJoinedCommunity === true) {
    // User is authenticated and to the community
    return <>{children}</>;
  }

  // If none of the above conditions are met, throw an error
  throw new Error('Unexpected Error');
};

export default CommunityAuthRouter;
