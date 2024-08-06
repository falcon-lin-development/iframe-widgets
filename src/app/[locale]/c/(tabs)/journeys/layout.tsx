import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';
export const metadata: Metadata = {
  title: 'Mootiez Explore',
  description: 'Mootiez Explore Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Logger eventName={EventName.quest_page_view}>{children}</Logger>
    </>
  );
}
