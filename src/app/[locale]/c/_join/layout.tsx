import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Join Mootiez Community',
  description: 'Join Mootiez Community Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Logger eventName={EventName.join_page_view}>{children}</Logger>
    </>
  );
}
