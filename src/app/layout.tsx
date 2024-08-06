import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import styles from './page.module.css';
import '@/styles/fonts.css';

// other libraries
import initTranslations from '@/i18n';

// providers
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import StoreProvider from '@/app/providers/StoreProvider';
import TranslationsProvider from '@/app/providers/TranslationsProvider';
import MUIThemeProvider from '@/app/providers/MUIThemeProvider';
import AuthProvider from '@/app/providers/AuthProvider';
import AppRoutingProvider from '@/app/providers/AppRoutingContextProvider';
import AuthRouterStatesProvider from '@/app/providers/AuthRouterStatesContextProvider';
import LogEventProvider from '@/app/providers/LogEventContextProvider';
import GAScripts from '@/app/providers/GAScripts';
import GraphQLProvider from './providers/GraphQLProvider';
// Routers

import AuthRouter from './[locale]/AuthRouter.client';
// constants
import { protectedRoutes, communityProtectedRoutes } from '@/routes/routes';
import assets from '@/constants';
import Head from 'next/head';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });
const i18nNamespaces = ['tests'];

export const metadata: Metadata = {
  metadataBase: new URL(process.env.WEBAPP_URL || 'http://localhost:3000/'),
  title: 'Mootiez Community',
  description: 'Best Community for Mootiez',
  icons: [
    {
      // media: '(prefers-color-scheme: light)',
      url: assets.favicon,
    },
  ],
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang="en">
      <link rel="icon" href={assets.favicon} sizes="any" />
      {process.env.ENV === 'prod' && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PQQHNG8D');`}
          </Script>

          {/* <!-- Hotjar Tracking Code for Mootiez App -->
            <script>
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:5067537,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            </script> 
          */}

          <Script id="hotjar" strategy="afterInteractive">
            {`(function(h,o,t,j,a,r){ 
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5067537,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
          </Script>
        </>
      )}
      <body className={`${inter.className} ${styles.mobileLayout}`}>
        {/* Google Tag Manager (noscript) */}
        {process.env.ENV === 'prod' && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PQQHNG8D"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <MUIThemeProvider>
            <AuthProvider>
              <GraphQLProvider
              // must be after authentication
              >
                <StoreProvider>
                  <TranslationsProvider
                    namespaces={i18nNamespaces}
                    locale={locale}
                    resources={resources}
                  >
                    <AppRoutingProvider
                      protectedRoutes={protectedRoutes}
                      communityProtectedRoutes={communityProtectedRoutes}
                    >
                      <AuthRouterStatesProvider>
                        <LogEventProvider>
                          <AuthRouter>{children}</AuthRouter>
                        </LogEventProvider>
                      </AuthRouterStatesProvider>
                    </AppRoutingProvider>
                  </TranslationsProvider>
                </StoreProvider>
              </GraphQLProvider>
            </AuthProvider>
          </MUIThemeProvider>
        </AppRouterCacheProvider>
      </body>

      {process.env.ENV === 'prod' && <GAScripts />}
    </html>
  );
}
