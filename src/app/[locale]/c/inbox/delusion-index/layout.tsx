import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delusion Index Report',
  description: 'Delusion Index Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
