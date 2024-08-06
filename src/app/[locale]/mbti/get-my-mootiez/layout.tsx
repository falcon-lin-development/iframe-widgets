import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get My Mootiez',
  description: 'Get My Mootiez Page',
};

type LayoutProps = {
  // params: { locale: string };ß
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  // see if there's any way to not double call this API
  return <>{children}</>;
}
