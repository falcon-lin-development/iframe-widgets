import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Mootiez Would You Rather',
  description: 'Mootiez Would You Rather Page',

  openGraph: {
    siteName: 'Mootiez Connect',
    title: 'Mootiez Would You Rather Question',
    type: 'website',
    description: 'Mootiez Would You Rather Question Page',
    // url: 'https://www.yourwebsite.com/page',
    // image: '/images/og-image.jpg', // Reference to an image in the public directory
    images: [
      {
        url: `${process.env.WEBAPP_URL}/others/quests/11/image.png`,
        width: 600,
        height: 600,
        alt: 'Og Image Alt',
        type: 'image/png',
      },
    ],
  },
};

type LayoutProps = {
  params: { locale: string; qid: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({
  children,
  params: { locale, qid },
}: LayoutProps) {
  return (
    <>
      <Logger eventName={EventName.would_you_rather_question_page_view}>
        {children}
      </Logger>
    </>
  );
}
