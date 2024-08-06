'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setCommunityDataStore } from '@/redux/features/community/communityDataStoreSlice';
import { getCommunityDataStore } from '@/data/repositaries/CommunityDataStoreRepo';
import React, { useMemo, createContext } from 'react';

import { useEffect } from 'react';
import { Community } from '@/data/services/fetchCommunityService';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import useCommunity from '@/hooks/useCommunity';

type CommunityDataStorContextType = {
  state: {
    communityDataStore: Record<string, any>;
  };
  actions: {
    refreshCommunityDataStore: () => Promise<void>;
  };
};

const _useCommunityDataStore = () => {
  const { community } = useCommunity();
  const {
    getters: { checkIsAuthenticated },
    utils: { getBearerToken },
  } = useDGAuth();
  const [isInit, setIsInit] = React.useState(false);

  const dispatch = useAppDispatch();
  const communityDataStore = useAppSelector(
    (state) => state.communityDataStoreSlice.value,
  );

  const _refreshCommunityDataStore = async () => {
    dispatch(
      setCommunityDataStore(
        await getCommunityDataStore({
          communityId: community.community_id,
          accessToken: (await getBearerToken()).jwtToken,
        }),
      ),
    );
  };

  useEffect(() => {
    // refresh the community data when the path changes
    const _saveRefresh = async () => {
      if (!isInit && checkIsAuthenticated()) {
        console.log('reload community data:', communityDataStore);
        setIsInit(true);
        await _refreshCommunityDataStore();
      }
    };
    _saveRefresh();
  }, [checkIsAuthenticated]);

  return {
    state: {
      communityDataStore,
    },
    actions: {
      refreshCommunityDataStore: () => {
        return _refreshCommunityDataStore();
      },
    },
  };
};
const CommunityDataStoreContext =
  createContext<CommunityDataStorContextType | null>(null);

export const useCommunityDataStoreContext = () => {
  const context = React.useContext(CommunityDataStoreContext);
  if (!context) {
    throw new Error(
      'useCommunityDataStoreContext must be used within a CommunityDataStoreContextProvider',
    );
  }
  return context;
};

const CommunityDataStoreContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = _useCommunityDataStore();

  return (
    <CommunityDataStoreContext.Provider value={value}>
      {children}
    </CommunityDataStoreContext.Provider>
  );
};

export default CommunityDataStoreContextProvider;
