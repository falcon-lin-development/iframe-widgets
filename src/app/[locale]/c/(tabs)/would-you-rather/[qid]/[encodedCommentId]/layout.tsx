import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Mootiez Would You Rather Question - Replies',
  description: 'Mootiez Would You Rather Question - Replies Page',

  openGraph: {
    siteName: 'Mootiez Connect',
    title: 'Mootiez Would You Rather Question - Replies',
    type: 'website',
    description: 'Mootiez Would You Rather Question - Replies Page',
  },
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Logger eventName={EventName.would_you_rather_question_replies_page_view}>
        {children}
      </Logger>
    </>
  );
}
