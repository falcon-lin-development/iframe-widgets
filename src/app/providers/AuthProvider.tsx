'use client';
import { DGAuthProvider } from '@dttd-io/dg-auth-lib';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = process.env.AUTH_ENV;
  const oauth_redirect_url = process.env.GOOGLE_OAUTH_CALLBACK_URL;
  // console.log('AuthProvider:', env, oauth_redirect_url);
  if (!env || !oauth_redirect_url) {
    throw new Error('AuthProvider: env or oauth_redirect_url not set');
  }

  return (
    <DGAuthProvider
      env={env}
      oauth_redirect_url={oauth_redirect_url}
      verbose={process.env.NODE_ENV === 'development'}
    >
      {children}
    </DGAuthProvider>
  );
}
