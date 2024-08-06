import { Metadata } from 'next';
import Head from 'next/head';
import Logger from './Logger.client';

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
      <Logger>{children}</Logger>
    </>
  );
}
