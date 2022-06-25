import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const PUBLIC_ROUTES = ['/'];

interface AuthProvider {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProvider) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === 'unauthenticated' &&
      !PUBLIC_ROUTES.includes(router.pathname)
    ) {
      router.replace('/login');
    }

    if (status === 'authenticated' && PUBLIC_ROUTES.includes(router.pathname)) {
      router.replace('/');
    }
  }, [status]);

  return <>{children}</>;
}

export default AuthProvider;
