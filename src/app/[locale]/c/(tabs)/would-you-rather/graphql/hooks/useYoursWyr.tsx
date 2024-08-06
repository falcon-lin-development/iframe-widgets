'use client';
import { useMemo, useEffect, useState } from 'react';

// client
import { useMutation, useQuery } from 'urql';

// query
import { Community } from '@/data/services/fetchCommunityService';
import {
  GET_YOURS_WYR_POSTS_QUERY,
  GetYoursWyrList,
} from '../models/yoursWyrList';
import { WyrPost } from '../models/WyrPost';

export const useYoursWyr = (community: Community) => {
  const [lastId, setLastId] = useState<string>('');

  const [postBuffer, setPostBuffer] = useState<WyrPost[]>([]);
  const [result, reexecuteQuery] = useQuery<{
    getYourWyrList: GetYoursWyrList;
  }>({
    query: GET_YOURS_WYR_POSTS_QUERY,
    variables: {
      lastId: lastId,
      pageSize: 5,
      communityId: community.community_id,
    },
    requestPolicy: 'network-only',
  });

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
        lastId === '' ? [] : postBuffer,
        result.data.getYourWyrList.posts,
      );
      setPostBuffer(newBuffer);
      // console.log('yours wyr', newBuffer);
    }
  }, [result.data]);

  return {
    state: {
      yoursWyrState: {
        data: {
          getYourWyrList: {
            posts: postBuffer,
            lastId: result.data?.getYourWyrList.lastId,
          },
        },
        error: result.error,
        fetching: result.fetching,
        stale: result.stale,
        extensions: result.extensions,
      },
    },
    actions: {
      refreshYoursWyr: () => {
        if (lastId !== '') {
          setLastId('');
        } else {
          reexecuteQuery({ requestPolicy: 'network-only' });
        }
      },
      queryNextYoursWyr: () => {
        // console.log("fetch new");
        setLastId(result.data!.getYourWyrList.lastId); // graphql auto refresh
      },
    },
  };
};
