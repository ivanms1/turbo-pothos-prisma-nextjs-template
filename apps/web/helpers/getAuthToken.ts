import { getSession } from 'next-auth/react';
import { TOKEN_NAME } from '../const';
import isWindowPresent from './isWindowPresent';

async function getAuthToken() {
  const session = await getSession();

  return session?.token;
}

export function setAuthToken(token: string) {
  if (isWindowPresent()) {
    return localStorage.setItem(TOKEN_NAME, token);
  }
}

export default getAuthToken;
