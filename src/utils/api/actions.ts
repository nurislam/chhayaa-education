'use server';

import { cookies } from 'next/headers';

export const getserverAuth = async () => {
  const cookieStore = await cookies();
  const authCred = cookieStore.get('AUTH_CRED');


  if (!authCred) {
    return null; 
  }

  return JSON.parse(authCred.value);
};
