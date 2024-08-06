import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Welcome to Mootiez!',
  description: 'Mootiez Home Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string] | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  // see if there's any way to not double call this API
  return (
    <>
      <Logger eventName={EventName.auth_page_view}>{children}</Logger>
    </>
  );
}
