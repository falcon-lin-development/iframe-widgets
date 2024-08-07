import { Metadata } from 'next';
import GraphQLProvider from '@/app/providers/GraphQLProvider';

export const metadata: Metadata = {
  title: 'Mootiez ChatRoom',
  description: 'Mootiez ChatRoom Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <GraphQLProvider>{children}</GraphQLProvider>
    </>
  );
};

export default Layout;
