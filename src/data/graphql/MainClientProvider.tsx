'use client';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Client, Provider as URQLProvider } from 'urql';
import { createChatClient, createMainClient } from '@/data/graphql/clients';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

const MainClientContext = createContext<ReturnType<typeof _useClient> | null>(
  null,
);

const _useClient = () => {
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const _client = useMemo(
    () => createMainClient(getBearerToken),
    [getBearerToken],
  );

  return {
    client: _client,
  };
};

export const MainClientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = _useClient();

  return (
    <MainClientContext.Provider value={value}>
      {value.client ? (
        <URQLProvider value={value.client}>{children}</URQLProvider>
      ) : (
        children
      )}
    </MainClientContext.Provider>
  );
};

export const useMainClient = (): ReturnType<typeof _useClient> => {
  const context = React.useContext(MainClientContext);
  if (!context) {
    throw new Error('useMainClient must be used within a MainClientProvider');
  }
  return context;
};
