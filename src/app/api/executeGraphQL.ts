type GraphQLRequestParam = {
  query: string;
  variables: any;
  authToken: string;
};

/**
 * This is standard function to execute GraphQL queries and mutations.
 */
export async function executeGraphQL(
  endpoint: string,
  { query, variables, authToken }: GraphQLRequestParam,
) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}
