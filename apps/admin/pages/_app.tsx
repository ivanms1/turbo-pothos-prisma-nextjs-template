import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

import useApollo from '@/hooks/useApollo';

function CustomApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps);
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default CustomApp;
