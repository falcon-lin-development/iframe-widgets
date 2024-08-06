'use client';

// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  CheckUserHandleValidityMutationResponse,
  CHECK_USER_HANDLE_VALIDITY_MUTATION,
} from '../models/checkUserHandleValidity';

export const useMutationCheckUserHandle = () => {
  const [result, checkUserHandle] =
    useMutation<CheckUserHandleValidityMutationResponse>(
      CHECK_USER_HANDLE_VALIDITY_MUTATION,
    );

  return {
    state: {
      checkUserHandleState: result,
    },
    actions: {
      checkUserHandle: ({ handle }: { handle: string }) => {
        const promise = checkUserHandle({
          userHandle: handle,
        });
        return promise;
      },
    },
  };
};
