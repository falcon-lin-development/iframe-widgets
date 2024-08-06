'use client';
import { useMemo, useEffect, useState, useRef } from 'react';

// client
import { useMutation, useQuery } from 'urql';

// models / query
import { Community } from '@/data/services/fetchCommunityService';
import {
  GET_POPULAR_WYR_POSTS_QUERY,
  GetPopularWyrList,
} from '../models/popularWyrPostList';
import { WyrPost } from '../models/WyrPost';

export const usePopularWyr = (community: Community) => {
  const [lastId, setLastId] = useState<string>('');
  // const lastId = useRef<string>('');
  const [postBuffer, setPostBuffer] = useState<WyrPost[]>([]);
  const [result, reexecuteQuery] = useQuery<{
    getPopularWyrList: GetPopularWyrList;
  }>({
    query: GET_POPULAR_WYR_POSTS_QUERY,
    variables: { lastId: lastId, pageSize: 5 },
    requestPolicy: 'network-only',
  });

  // merge list
  useEffect(() => {
    const _mergeList = (oldList: WyrPost[], newList: WyrPost[]) => {
      let newBuffer;
      if (oldList.length === 0) {
        newBuffer = newList;
      } else {
        const lastTimeStamp = oldList[oldList.length - 1].createdAt;
        newBuffer = [
          ...oldList,
          ...newList.filter((v: WyrPost) => v.createdAt < lastTimeStamp),
        ];
      }
      return newBuffer;
    };

    //  if data, merge list
    if (result.data) {
      const newBuffer = _mergeList(
        lastId === '' ? [] : postBuffer, // for new fetch, lastId is empty, negect old list
        result.data.getPopularWyrList.posts,
      );
      setPostBuffer(newBuffer);
      // console.log('popular wyr', result, newBuffer);
    }
  }, [result.data]);

  return {
    state: {
      popularWyrState: {
        data: {
          getPopularWyrList: {
            posts: postBuffer,
            lastId: result.data?.getPopularWyrList.lastId,
          },
        },
        error: result.error,
        fetching: result.fetching,
        stale: result.stale,
        extensions: result.extensions,
      },
    },
    actions: {
      refreshPopularWyr: () => {
        // lastId.current = '';
        if (lastId !== '') {
          setLastId('');
        } else {
          reexecuteQuery({ requestPolicy: 'network-only' });
        }
      },
      queryNextPopularWyr: () => {
        // console.log("fetch new");
        setLastId(result.data!.getPopularWyrList.lastId); // graphql auto refresh
      },
    },
  };
};
