import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { authExchange, AuthConfig } from '@urql/exchange-auth';
import { createClient as createWSClient } from 'graphql-ws';

import { API_BASE_URL } from '../base';

export const API_PATH = {
  main: API_BASE_URL + '/api/v1/graphql',
  chat: API_BASE_URL + '/api/v1/graphql-chatbot',
};

export const createMainClient = (getBearerToken: () => Promise<any>) => {
  return createClients(API_PATH.main, getBearerToken);
};

export const createChatClient = async (getBearerToken: () => Promise<any>) => {
  return createClients(API_PATH.chat, getBearerToken);
};

const createClients = (
  apiPath: string,
  getBearerToken: () => Promise<{
    jwtToken: string;
    username: string;
    email: string;
  }>,
) => {
  const wsClient = createWSClient({
    url: apiPath.replace(/^http/, 'ws'),
    connectionParams: async () => {
      try {
        const token = (await getBearerToken()).jwtToken;
        return {
          Authorization: `Bearer ${token}`,
        };
      } catch (e) {
        console.error('Failed to get authentication token:', e);
        return {};
      }
    },
  });

  const _client = new Client({
    url: apiPath,
    exchanges: [
      cacheExchange,
      authExchange(async (utils) => {
        let token: string | null = null;
        try {
          token = (await getBearerToken()).jwtToken;
        } catch (e) {
          console.error('error in client', e);
        }
        // console.log('token in client', token);
        return {
          addAuthToOperation(operation) {
            if (!token) return operation;
            return utils.appendHeaders(operation, {
              Authorization: `Bearer ${token}`,
            });
          },
        } as AuthConfig;
      }),
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || '' };
          return {
            subscribe(sink) {
              const unsubscribe = wsClient.subscribe(input, sink);
              return { unsubscribe };
            },
          };
        },
      }),
    ],
  });

  return _client;
};
