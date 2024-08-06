import { Metadata } from 'next';
import CommunityAuthRouter from './providers/CommunityAuthRouter.client';
import { CommunityNotificationContextProvider } from './providers/CommunityNotificationContextProvider';

export const metadata: Metadata = {
  title: 'Mootiez Community Explore',
  description: 'Mootiez Community Explore Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default async function Layout({ children }: LayoutProps) {
  // see if there's any way to not double call this API
  return (
    <CommunityAuthRouter>
      <CommunityNotificationContextProvider>
        {children}
      </CommunityNotificationContextProvider>
    </CommunityAuthRouter>
  );
}
