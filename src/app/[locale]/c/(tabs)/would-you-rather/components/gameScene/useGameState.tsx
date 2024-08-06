'use client';

import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';

import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { Option, ResponseType, WyrPost } from '../../graphql/models/WyrPost';
import { useWyrPost } from '../../graphql/hooks/useWyrPost';
import { formatCounts } from '@/utils/formatCounts';

export enum GAMESTATE {
  INIT,
  PLAYING,
  PAUSED,
  END,
}

export enum INGAMESTATE {
  QUESTION,
  SUMMITING,
  RESULT,
  ERROR,
}

export type GameStateHook = ReturnType<typeof useGameState>;

export const useGameState = ({ wyrPost }: { wyrPost: WyrPost }) => {
  /**
   * META
   *
   */
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);

  /**
   * Game states
   */
  // used by fading appbars
  const [gameState, setGameState] = useState<GAMESTATE>(GAMESTATE.INIT);

  const {
    state: {
      voteState,
      toggleLikeState,
      listPostCommentsState,
      addCommentState,
    },
    actions: {
      voteWyrPost,
      toggleLikeWyrPost,
      skipWyrPost,
      viewWyrPost,
      refreshWyrComments,
      queryNextWyrComments,
      addComment,
      reportCommentById,
      toggleLikePostCommentById,
    },
  } = useWyrPost(wyrPost, community);
  const voteData = useMemo(() => {
    return (
      voteState.data?.respondWyrPost || voteState.data?.skipWyrPost || undefined
    );
  }, [voteState.data]);

  // states
  const isInit = useMemo(() => {
    return Boolean(
      community.community_id && communityProfile.community_id && wyrPost.postId,
    );
  }, [community.community_id, communityProfile.community_id, wyrPost.postId]);

  const inGameState: INGAMESTATE = useMemo(() => {
    let _inGameState;

    if (wyrPost.error || voteState.error || voteData?.error) {
      _inGameState = INGAMESTATE.ERROR;
    } else if (
      wyrPost.userDetails?.response_id ||
      voteData?.reference?.response_id
    ) {
      _inGameState = INGAMESTATE.RESULT;
    } else if (voteState.fetching) {
      _inGameState = INGAMESTATE.SUMMITING;
    } else if (wyrPost.postId) {
      _inGameState = INGAMESTATE.QUESTION;
    } else {
      _inGameState = INGAMESTATE.ERROR;
    }

    return _inGameState;
  }, [wyrPost, voteState]);

  const isSkipped = useMemo(() => {
    const _isSkipped = Boolean(
      wyrPost.userDetails?.response_type === ResponseType.skip ||
        voteData?.reference?.response_type === ResponseType.skip,
    );
    return _isSkipped;
  }, [wyrPost, voteData]);

  /**
   * Helpers
   */
  const isOptionSelected = (option: Option) => {
    const isSelectedThis = Boolean(
      wyrPost.userDetails?.response_option_id === option.option_id ||
        voteData?.reference?.response_option_id === option.option_id,
    );
    return isSelectedThis;
  };
  const calcVotePct = (option: Option) => {
    const totalVotes =
      voteData?.reference.response_stats.total_count ||
      wyrPost?.userDetails.response_stats?.total_count;
    if (!totalVotes) {
      return 0;
    }
    const optionVotes =
      voteData?.reference.response_stats.option_count[option.option_id] ||
      wyrPost?.userDetails.response_stats?.option_count[option.option_id];
    if (!optionVotes) {
      return 0;
    }
    // if optionVotes > totalVotes*0.5 , return math.ceil
    if (optionVotes > totalVotes * 0.5) {
      return Math.ceil((optionVotes / totalVotes) * 100);
    }
    // otherwise, return math.floor
    return Math.floor((optionVotes / totalVotes) * 100);
  };

  return {
    const: {},
    state: {
      isInit,
      community,
      communityProfile,
      gameState,
      inGameState,
      isSkipped,
      voteState,
      toggleLikeState,
      listPostCommentsState,
      addCommentState,
    },
    actions: {
      voteWyrPost: async (vote: string) => {
        setGameState(GAMESTATE.PLAYING);
        voteWyrPost(vote);
      },
      toggleLikeWyrPost,
      voteAsSkipWyrPost: skipWyrPost,
      viewWyrPost,
      refreshWyrComments,
      queryNextWyrComments,
      addComment,
      reportCommentById,
      toggleLikePostCommentById,
    },
    helpers: {
      isOptionSelected,
      calcVotePct,
      formatCounts: (count?: number): string => {
        return formatCounts(count);
      },
    },
  };
};
