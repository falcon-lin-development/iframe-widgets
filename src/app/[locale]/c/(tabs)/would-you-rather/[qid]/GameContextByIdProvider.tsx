'use client';

import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';

// constants
import routes from '@/routes/routes';

// hooks
import { Option, WyrPost } from '../graphql/models/WyrPost';
import {
  GameStateHook,
  GAMESTATE,
  INGAMESTATE,
  useGameState,
} from '../components/gameScene/useGameState';
import { useGetWyrPostById } from '../graphql/hooks/useGetWyrPostById';
import { useAuthRouterStates } from '@/app/providers/AuthRouterStatesContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

export interface GameStateContextType {
  gameContext: GameStateHook;
  additional: {
    init: boolean;
    isAuthenticated: boolean;
    wyrPost: WyrPost;
  };
}

const GameStateContext = createContext<GameStateContextType | null>(null);

const _useGameState = ({ wyrPost }: { wyrPost: WyrPost }): GameStateHook => {
  /**
   * META
   *
   */
  // /**
  //  * Game states
  //  */
  const _useGameState = useGameState({ wyrPost });
  const gameState = GAMESTATE.PLAYING;

  return {
    const: {
      ..._useGameState.const,
    },
    state: {
      ..._useGameState.state,
      gameState,
    },
    actions: {
      ..._useGameState.actions,
    },
    helpers: {
      ..._useGameState.helpers,
    },
  };
};

const _useWyrFromId = (qid: string) => {
  const {
    state: { wyrPostState },
  } = useGetWyrPostById(qid);
  const {
    state: { isAuthenticated, isJoinedCommunity },
  } = useAuthRouterStates();
  const { navigate } = useAppRouting();

  // if not join but authenticated, redirect to join
  useEffect(() => {
    if (isAuthenticated && isJoinedCommunity === false) {
      navigate(routes.c.join);
    }
  }, [isAuthenticated, isJoinedCommunity]);

  return {
    wyrPost: wyrPostState.data?.getWyrPost,
    isAuthenticated,
    init: Boolean(
      wyrPostState.data?.getWyrPost.postId && isAuthenticated !== null,
    ),
  };
};

export default function GameStateContextProvider({
  children,
  wyrPostId,
}: {
  children: React.ReactNode;
  wyrPostId: string;
}) {
  const { wyrPost, init, isAuthenticated } = _useWyrFromId(wyrPostId);
  const _provider: React.FC<{
    wyrPost: WyrPost;
    children: React.ReactNode;
  }> = ({ children, wyrPost }) => {
    const gameState = _useGameState({ wyrPost });

    return (
      <>
        <GameStateContext.Provider
          value={{
            gameContext: gameState,
            additional: {
              init,
              isAuthenticated: isAuthenticated!,
              wyrPost: wyrPost!,
            },
          }}
        >
          {children}
        </GameStateContext.Provider>
      </>
    );
  };

  if (!init) {
    return <LoadingPage />;
  }

  return <_provider wyrPost={wyrPost!}>{children}</_provider>;
}

export function useGameContext() {
  const context = useContext(GameStateContext);
  if (context === null) {
    throw new Error('useGameState must be used within a PageContextProvider');
  }
  return context;
}
