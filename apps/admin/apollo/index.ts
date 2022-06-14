import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import getAuthToken from '@/helpers/getAuthToken';

import { setContext } from '@apollo/client/link/context';

let apolloClient: ApolloClient<NormalizedCacheObject> | null;

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

const projectsMergeConfig: FieldPolicy<any, any, any> = {
  keyArgs: false,
  merge(existing = null, incoming) {
    if (!existing || !existing?.results?.length) {
      return incoming;
    }

    if (!incoming.prevCursor) {
      return existing;
    }

    if (existing.nextCursor === incoming.nextCursor) {
      return existing;
    }

    const existingResults = existing?.results ?? [];
    return {
      ...incoming,
      results: [...existingResults, ...incoming.results],
    };
  },
};

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    connectToDevTools: true,
    link: authLink.concat(
      createHttpLink({
        uri: process.env.NEXT_PUBLIC_SERVER_URL,
      })
    ),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getApprovedProjects: projectsMergeConfig,
            getMyProjects: projectsMergeConfig,
            adminGetNotApprovedProjects: projectsMergeConfig,
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState?: any) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.cache.extract();
    _apolloClient.cache.restore({
      ...existingCache,
      ...initialState,
    });
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}
