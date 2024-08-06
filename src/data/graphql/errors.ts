interface GraphqlError {
  __typename: 'GraphqlError' | string;
  error: string;
  message: string;
  statusCode: number;
}

export type { GraphqlError };
