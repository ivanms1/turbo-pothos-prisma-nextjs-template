import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import {
  ApolloClient,
  createHttpLink,
  FieldPolicy,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import getAuthToken from '@/helpers/getAuthToken';

import { setContext } from '@apollo/client/link/context';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | null;

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuthToken();

  return {
    headers: {
      ...headers,
      Authorization: token ?? headers?.Authorization,
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

    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}
