'use client';

import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';

// models
import { Community } from '@/data/services/fetchCommunityService';
// hooks
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { useSearchParams } from 'next/navigation';
import { usePopularWyr } from './graphql/hooks/usePopularWyr';
import { useYoursWyr } from './graphql/hooks/useYoursWyr';
import { useGetPointTrackingForWyr } from './graphql/hooks/useGetPointTrackingForWyr';

export enum GAMESTATE {
  INIT,
  PLAYING,
  PAUSED,
  END,
}

const PageStateContext = createContext<ReturnType<typeof _usePageState> | null>(
  null,
);

const _usePageState = () => {
  /**
   * META
   */
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);

  /**
   * Tabs
   */
  const param = useSearchParams();
  const { navigate } = useAppRouting();
  const tabId = useMemo(() => {
    return param.get('tabId') ? parseInt(param.get('tabId')!) : 0;
  }, [param.get('tabId')]);
  const _setTabId = (tabId: number) => {
    navigate(window.location.pathname, {
      searchParams: {
        tabId: tabId.toString(),
      },
    });
  };

  // refresh for popular wyr
  useEffect(() => {
    if (tabId === 0) {
      refreshPopularWyr();
    }
    if (tabId === 2) {
      refreshYoursWyr();
    }

    // window.location.reload();
  }, [tabId]);

  /**
   * WYR header
   */
  const {
    state: { pointTrackingForWyrState },
    actions: { refreshPointTrackingForWyr },
  } = useGetPointTrackingForWyr(community);

  /**
   * Popular Tab
   */
  const {
    state: { popularWyrState },
    actions: { refreshPopularWyr, queryNextPopularWyr },
  } = usePopularWyr(community);

  /**
   * Random Tab Game states
   */
  const gameState: GAMESTATE = useMemo(() => {
    return param.get('gamestate')
      ? (parseInt(param.get('gameState')!) as GAMESTATE)
      : GAMESTATE.INIT;
  }, [param.get('gamestate')]);
  const setGameState = (gameState: GAMESTATE) => {
    navigate(window.location.pathname, {
      searchParams: {
        tabId: tabId.toString(),
        gamestate: gameState,
      },
    });
  };

  /**
   * Yours Tab
   */
  const {
    state: { yoursWyrState },
    actions: { refreshYoursWyr, queryNextYoursWyr },
  } = useYoursWyr(community);

  /**
   * Init
   */
  const isInit = useMemo(() => {
    return community.community_id && communityProfile.community_id;
  }, [community.community_id, communityProfile.community_id]);

  return {
    const: {},
    state: {
      isInit,
      community,
      communityProfile,
      gameState,
      tabId,
      popularWyrState,
      yoursWyrState,
      pointTrackingForWyrState,
    },
    actions: {
      setGameState,
      setTabId: (tabId: number) => {
        setGameState(GAMESTATE.INIT);
        _setTabId(tabId);
      },
      refreshPopularWyr,
      queryNextPopularWyr,
      refreshYoursWyr,
      queryNextYoursWyr,
      refreshPointTrackingForWyr,
    },
  };
};

export default function PageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageState = _usePageState();
  return (
    <PageStateContext.Provider value={pageState}>
      {children}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (context === null) {
    throw new Error('usePageState must be used within a PageContextProvider');
  }
  return context;
}
