import { Metadata } from 'next';
import Head from 'next/head';
import Script from 'next/script';

export const metadata = {
  title: 'MBTI Section',
  description: 'MBTI Section',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};

export default function Layout({ children }: LayoutProps) {
  // see if there's any way to not double call this API
  return (
    <>
      {/* <Script src="https://drag-drop-touch-js.github.io/dragdroptouch/dist/drag-drop-touch.esm.min.js"
                type="module"
            >

            </Script>

            <link rel="preload" href="https://drag-drop-touch-js.github.io/dragdroptouch/dist/drag-drop-touch.esm.min.js" as="script" /> */}

      {children}
    </>
  );
}
