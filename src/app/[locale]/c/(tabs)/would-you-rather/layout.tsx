import { Metadata } from 'next';
// import Logger from './Logger.client';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Mootiez Would You Rather',
  description: 'Mootiez Would You Rather Page',

  openGraph: {
    siteName: 'Mootiez Connect',
    title: 'Mootiez Would You Rather',
    type: 'website',
    description: 'Mootiez Would You Rather Page',
    // url: 'https://www.yourwebsite.com/page',
    // image: '/images/og-image.jpg', // Reference to an image in the public directory
    images: [
      {
        url: `${process.env.WEBAPP_URL}/others/quests/11/image.png`,
        width: 600,
        height: 600,
        alt: 'Og Image Alt',
      },
    ],
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
      <Logger eventName={EventName.would_you_rather_page_view}>
        {children}
      </Logger>
    </>
  );
}
