import { NextRequest } from 'next/server';
import { AuthenticationError } from './errors';

export const checkAndExtractAuthToken = (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }
  const authToken = authHeader.split('Bearer ')[1];
  if (!authToken) {
    throw new AuthenticationError('Authentication token is required');
  }
  return authToken;
};
