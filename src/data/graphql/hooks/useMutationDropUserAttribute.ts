'use client';

// client
import { useMutation, useQuery } from 'urql';

// models / query
import {
  DropAttributesMutationResponse,
  DROP_ATTRIBUTES_MUTATION,
} from '../models/dropUserAttribute';

export const useMutationDropUserAttribute = () => {
  const [result, dropUserAttribute] =
    useMutation<DropAttributesMutationResponse>(DROP_ATTRIBUTES_MUTATION);

  return {
    state: {
      dropUserAttributeState: result,
    },
    actions: {
      dropUserAttribute: ({
        categoryType,
        categoryValue,
      }: {
        categoryType: string;
        categoryValue: string;
      }) => {
        const promise = dropUserAttribute({
          categoryType,
          categoryValue,
        });
        return promise;
      },
    },
  };
};
