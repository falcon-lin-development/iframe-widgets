import { Metadata } from 'next';
import Head from 'next/head';
// import Logger from './Logger.client';

export const metadata = {
  title: 'Main MBTI Quiz',
  description: 'Main MBTI Quiz',
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
      <>{children}</>
    </>
  );
}
