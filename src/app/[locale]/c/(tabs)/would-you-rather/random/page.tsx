'use client';
import { useEffect, useMemo } from 'react';
import { NextPage } from 'next';

// skeleton
import ScrollingSection from '../components/ScollingSection/ScrollingSection';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import BottomInputBar from '../components/ScollingSection/BottomInputBar.client';

// model
import { WyrPost, isWyrPost } from '../graphql/models/WyrPost';
import routes from '@/routes/routes';

// hooks
import useCommunity from '@/hooks/useCommunity';
import {
  GAMESTATE,
  INGAMESTATE,
  useGameState,
} from '../components/gameScene/useGameState';
import { useSuggestRandomWyr } from '../graphql/hooks/useSuggestRandomWyr';
import { useLikeHook } from '../components/gameScene/useLikeHook';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useSearchParams } from 'next/navigation';

const _usePageState = () => {
  const { community } = useCommunity();
  const _suggestRandomWyr = useSuggestRandomWyr(community);

  return {
    sugguestRandomWyr: _suggestRandomWyr,
    state: {
      init: _suggestRandomWyr.state.init,
      wyrPost: _suggestRandomWyr.state.suggestedWyrPost,
    },
  };
};

const Page: NextPage = () => {
  const {
    sugguestRandomWyr,
    state: { init },
  } = _usePageState();
  if (!init) {
    return <LoadingPage />;
  }

  return <PageGameSection sugguestRandomWyrHook={sugguestRandomWyr} />;
};

const PageGameSection: React.FC<{
  sugguestRandomWyrHook: ReturnType<typeof useSuggestRandomWyr>;
}> = ({ sugguestRandomWyrHook }) => {
  const wyrPost =
    sugguestRandomWyrHook.state.suggestRandomWyrState.data!.suggestRandomWyr;
  const gameState = useGameState({ wyrPost });
  const { constructPath } = useAppRouting();
  // const param = useSearchParams();

  return (
    <ScrollingSection
      wyrPost={wyrPost}
      gameContext={gameState}
      otherProps={{
        backUrl: constructPath(routes.c.would_you_rather._home, {
          searchParams: {
            tabId: 1,
            gamestate: GAMESTATE.PAUSED,
          },
        }),
        nextQuestion: () => {
          sugguestRandomWyrHook.actions.nextRandomWyr();
        },
      }}
      bottomInputBar={
        <BottomInputBar gameContext={gameState} wyrPost={wyrPost} />
      }
    />
  );
};

export default Page;
