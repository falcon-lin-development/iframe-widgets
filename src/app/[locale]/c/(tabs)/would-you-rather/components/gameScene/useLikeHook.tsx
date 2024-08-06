'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { PostCategory, WyrPost, isWyrPost } from '../../graphql/models/WyrPost';

// hooks
import { GameStateHook, useGameState } from '../gameScene/useGameState';
import { formatCounts } from '@/utils/formatCounts';

export type LikeHook = ReturnType<typeof useLikeHook>;

export type UseLikeHookProp = {
  isInitiallyLiked: boolean;
  originalLikeCount: number;
  toggleLike: (isLiked: boolean) => Promise<any>;
};

export const useLikeHook = ({
  isInitiallyLiked,
  originalLikeCount,
  toggleLike,
}: UseLikeHookProp) => {
  // backend count
  const initLiked = isInitiallyLiked;
  // const initLiked = true;
  const [isLiked, setIsLiked] = useState<boolean>(initLiked);
  const likeCount = useMemo(() => {
    if (initLiked) {
      if (!isLiked) {
        return originalLikeCount - 1;
      }
      return originalLikeCount;
    } else {
      if (isLiked) {
        return originalLikeCount + 1;
      }
      return originalLikeCount;
    }
  }, [originalLikeCount, isLiked, initLiked]);

  useLayoutEffect(() => {
    setIsLiked(initLiked);
  }, [initLiked]);

  const formatedCounts = useMemo(() => {
    return formatCounts(likeCount);
  }, [likeCount]);

  const _toggleLike = () => {
    toggleLike(!isLiked).then((result) => {
      console.log('toggleLike result:', result);
    });
    setIsLiked(!isLiked);
  };

  return {
    state: {
      isLiked,
      likeCount,
      formatedCounts,
    },
    actions: {
      toggleLike: _toggleLike,
    },
  };
};
