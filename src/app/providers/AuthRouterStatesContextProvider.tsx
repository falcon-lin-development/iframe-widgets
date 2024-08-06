'use client';
import React, { useMemo, createContext } from 'react';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

// other library
import { useDGAuth, DGAuthState } from '@dttd-io/dg-auth-lib';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';
import { CommunityStates } from '@/data/repositaries/CommunityProfileRepo';

type AuthRouterStatesContextType = {
  hooks: {
    communityProfileHook: ReturnType<typeof useCommunityProfile>;
  };
  state: {
    pathname: string;
    searchParams: ReadonlyURLSearchParams;
    searchParamsMap: Record<string, string>;
    // authState: DGAuthState;
    isAuthInit: boolean;
    isAuthenticated: boolean | null;
    isJoinedCommunity: boolean | null;
  };
  getters: {
    checkIsAuthenticated: () => boolean | null;
  };
};

const AuthRouterStatesContext =
  createContext<AuthRouterStatesContextType | null>(null);

const _useAuthRouterStates = () => {
  /**
   * Hooks
   */
  const { community } = useCommunity();
  const _profileHook = useCommunityProfile(community);
  const { communityProfile, isProfile404 } = _profileHook;
  const pathname = usePathname();
  const { searchParams, searchParamsMap } = useSearchParamsMap();
  const {
    state: { authState },
    getters: { checkIsAuthenticated },
    utils: { getBearerToken },
  } = useDGAuth();

  /**
   * States
   */
  const isInit = useMemo(() => {
    /**
     * @dev // Unknown means not initialized
     */
    return authState !== DGAuthState.Unknown;
  }, [authState]);

  const isAuthenticated = useMemo(() => {
    return checkIsAuthenticated();
  }, [checkIsAuthenticated()]);

  const isJoinedCommunity = useMemo(() => {
    // if not sure, return null
    if (
      isAuthenticated === false || // not auth -> not sure
      isAuthenticated === null
    ) {
      return null;
    } else if (!communityProfile.states) {
      // not fetched
      if (isProfile404) {
        // 404 -> not joined
        return false;
      } else {
        return null; // not sure
      }
    } else {
      if (
        communityProfile.states.is_left === false &&
        communityProfile.states.current_state === CommunityStates.joined
      ) {
        return true;
      } else {
        return false;
      }
    }
  }, [isAuthenticated, communityProfile.states, isProfile404]);

  return {
    hooks: {
      communityProfileHook: _profileHook,
    },
    state: {
      pathname,
      searchParams: searchParams,
      searchParamsMap,
      // authState: authState as DGAuthState,
      isAuthInit: isInit,
      isAuthenticated,
      isJoinedCommunity,
    },
    getters: {
      checkIsAuthenticated,
    },
  };
};

export const useAuthRouterStates = () => {
  const context = React.useContext(AuthRouterStatesContext);
  if (!context) {
    throw new Error(
      'useAuthRouterStates must be used within a AuthRouterStatesProvider/AuthRouter',
    );
  }
  return context;
};

const AuthRouterStatesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = _useAuthRouterStates();
  return (
    <AuthRouterStatesContext.Provider value={value}>
      {children}
    </AuthRouterStatesContext.Provider>
  );
};

export default AuthRouterStatesProvider;
