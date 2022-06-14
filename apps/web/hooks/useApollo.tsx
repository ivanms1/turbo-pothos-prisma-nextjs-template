import { useMemo } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { initializeApollo } from '../apollo';

function useApollo(initialCache: ApolloClient<NormalizedCacheObject>) {
  const client = useMemo(() => initializeApollo(initialCache), [initialCache]);

  return client;
}

export default useApollo;
