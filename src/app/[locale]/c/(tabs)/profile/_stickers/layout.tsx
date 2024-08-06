import { Metadata } from 'next';
import Logger from './Logger.client';

export const metadata: Metadata = {
  title: 'Mootiez Stickers',
  description: 'Mootiez Stickers Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Logger>{children}</Logger>
    </>
  );
}
